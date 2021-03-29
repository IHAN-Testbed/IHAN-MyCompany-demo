import urllib.parse
from typing import Optional

import httpx
import jwt
from fastapi import APIRouter, Cookie, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from firedantic import ModelNotFoundError
from pydantic import BaseModel

from app.api import MeResponse, StartLoginRequest, StartLoginResponse
from app.auth import (
    fetch_keys,
    generate_logout_state,
    generate_nonce,
    generate_state,
    get_valid_state,
    openid_conf,
    parse_token,
    validate_token,
)
from app.errors import AuthException, ReturnPathValidationFailed
from app.log import logger
from app.models import LogoutState
from app.utils import get_frontend_settings_by_path, set_cookie, url_for
from settings import conf

router = APIRouter()

# Use a shared httpx.AsyncClient() to be able to reuse the connection
client = httpx.AsyncClient()


# For validating token endpoint response
class OAuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str]
    id_token: str


class UserInfoResponse(BaseModel):
    sub: str
    name: Optional[str] = None


@router.on_event("startup")
async def startup_event():
    await openid_conf.fetch(client)
    await fetch_keys(client=client)


@router.get(
    "/me", summary="Check current user", tags=["auth"], response_model=MeResponse
)
async def me(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(401, "Authentication required")

    headers = {"Authorization": f"Bearer {access_token}"}

    res = await client.post(url=openid_conf.userinfo_endpoint, headers=headers)

    if res.is_error:
        expected_errors = {
            401: "Authentication required",
            403: "Forbidden",
        }
        if res.status_code in expected_errors:
            logger.debug(
                "Got error from user info endpoint", code=res.status_code, err=res.text
            )
            raise HTTPException(res.status_code, expected_errors[res.status_code])
        else:
            logger.error(
                "Failed to call user info endpoint", code=res.status_code, err=res.text
            )
            raise HTTPException(502, "Error with authentication APIs")

    result = UserInfoResponse(**res.json())

    return MeResponse(id=result.sub, name=result.name)


@router.post(
    "/start_login",
    summary="Start login flow",
    tags=["auth"],
    response_model=StartLoginResponse,
)
async def start_login(
    req: Request, data: StartLoginRequest, id_token: str = Cookie(None)
):
    """
    API endpoint for starting the login flow; will give back a redirectUri to which the
    user should be redirected to authenticate.
    """
    if is_authenticated(id_token=id_token):
        raise HTTPException(403, "Already authenticated")

    return_path = data.returnPath
    await validate_return_path(return_path)

    try:
        get_frontend_settings_by_path(data.frontendPath)
    except KeyError:
        raise HTTPException(
            status_code=422, detail=f"Invalid frontendPath '{data.frontendPath}'"
        )

    nonce = generate_nonce()
    state = generate_state(return_path, nonce)

    params = urllib.parse.urlencode(
        {
            "response_type": "code",
            "client_id": conf.OPENID_CONNECT_CLIENT_ID,
            "acr_values": conf.OPENID_CONNECT_ACR_VALUES,
            "scope": conf.OPENID_CONNECT_SCOPES,
            "redirect_uri": url_for(
                req, "code_exchange", frontend_path=data.frontendPath
            ),
            "nonce": nonce,
            "state": state,
        }
    )
    uri = f"{openid_conf.authorization_endpoint}?{params}"

    return StartLoginResponse(redirectUri=uri)


@router.get(
    "/return{frontend_path:path}",
    summary="Exchange authorization code for auth cookies",
    tags=["auth"],
    name="code_exchange",
)
async def code_exchange(
    request: Request,
    frontend_path: str,
    code: str,
    state: str,
    id_token: str = Cookie(None),
):
    """
    The endpoint at which the user will land when coming back from the OpenID Connect
    provider.

    Handles the token exchange and sets the id_token and access_token cookies.

    Note that this endpoint is served in a web browser, not through an API call from the
    frontend. Hence any errors are handled by redirecting the user to a frontend side
    error page with a message and status code.
    """
    # Validate the frontend path and set the error page accordingly
    try:
        frontend_settings = get_frontend_settings_by_path(frontend_path)
    except KeyError:
        raise HTTPException(status_code=404, detail="Not found")
    error_page = f"{frontend_path}{frontend_settings.auth_error_page}"

    try:
        if is_authenticated(id_token=id_token):
            raise AuthException(403, "Already authenticated")

        login_state = get_valid_state(state)
        if not login_state:
            raise AuthException(400, "Invalid state")

        params = {
            "grant_type": "authorization_code",
            "redirect_uri": url_for(
                request, "code_exchange", frontend_path=frontend_path
            ),
            "code": code,
        }

        res = await client.post(
            url=openid_conf.token_endpoint,
            data=params,
            auth=(
                conf.OPENID_CONNECT_CLIENT_ID,
                conf.OPENID_CONNECT_CLIENT_SECRET.get_secret_value(),
            ),
        )

        if res.is_error:
            logger.error("Code exchange failed", code=res.status_code, err=res.text)
            raise AuthException(502, "Code exchange failed")

        result = OAuthTokenResponse(**res.json())

        try:
            id_token = validate_token(result.id_token)
        except jwt.exceptions.InvalidTokenError:
            logger.exception("Failed to validate token")
            raise AuthException(500, "Token validation failed")
        if login_state.nonce != id_token.nonce:
            logger.error("Got invalid nonce")
            raise AuthException(500, "Token validation failed")

        response = RedirectResponse(login_state.returnPath)
        set_cookie(response, "id_token", result.id_token)
        set_cookie(response, "access_token", result.access_token)

        return response

    except AuthException as ex:
        # This page is rendered in the browser, so any errors need to be handled by
        # redirecting to an actual error page rendered by the frontend
        logger.exception("Exception handled through redirect")
        message = urllib.parse.quote_plus(ex.detail)
        status_code = ex.status_code
        return RedirectResponse(
            f"{error_page}?message={message}&status_code={status_code}"
        )
    except Exception:
        logger.exception("Unhandled exception handled through redirect")
        message = urllib.parse.quote_plus("Unknown error, please try again.")
        return RedirectResponse(f"{error_page}?message={message}&status_code=500")


@router.get(
    "/start_logout",
    summary="Start logout flow",
    tags=["auth"],
)
async def start_logout(
    req: Request,
    frontend_path: str = Query(..., alias="frontendPath"),
    return_path: str = Query(..., alias="returnPath"),
    id_token: str = Cookie(...),
):
    # Validate the frontend path and set the error page accordingly
    try:
        frontend_settings = get_frontend_settings_by_path(frontend_path)
    except KeyError:
        raise HTTPException(status_code=404, detail="Not found")
    error_page = f"{frontend_path}{frontend_settings.auth_error_page}"

    try:
        try:
            await validate_return_path(return_path)
        except ReturnPathValidationFailed:
            raise AuthException(400, "Invalid returnPath")

        state = generate_logout_state(return_path)

        params = {
            "post_logout_redirect_uri": url_for(req, "logout"),
            "state": state,
        }
        if conf.OPENID_CONNECT_INCLUDE_ID_TOKEN_HINT_IN_LOGOUT:
            params["id_token_hint"] = id_token
        params = urllib.parse.urlencode(params)
        uri = f"{openid_conf.end_session_endpoint}?{params}"
        return RedirectResponse(uri)

    except AuthException as ex:
        # This page is rendered in the browser, so any errors need to be handled by
        # redirecting to an actual error page rendered by the frontend
        logger.exception("Exception handled through redirect")
        message = urllib.parse.quote_plus(ex.detail)
        status_code = ex.status_code
        return RedirectResponse(
            f"{error_page}?message={message}&status_code={status_code}"
        )
    except Exception:
        logger.exception("Unhandled exception handled through redirect")
        message = urllib.parse.quote_plus("Unknown error, please try again.")
        return RedirectResponse(f"{error_page}?message={message}&status_code=500")


@router.get("/logout", summary="Log out", name="logout", tags=["auth"])
async def logout(state: str):
    # Load the saved state to find redirect target
    try:
        ls = LogoutState.get_by_id(state)
    except ModelNotFoundError:
        raise HTTPException(404, "Invalid state")

    # Redirect the user back to desired target
    redirect_target = ls.redirect_target
    if ls.state:
        params = urllib.parse.urlencode({"state": ls.state})
        redirect_target += f"?{params}"
    resp = RedirectResponse(redirect_target)

    # Delete the cookies and state
    resp.delete_cookie(key="id_token")
    resp.delete_cookie(key="access_token")
    ls.delete()

    return resp


def is_authenticated(id_token: Optional[str]) -> bool:
    """
    Check if the user is authenticated (id_token exists and is valid)
    """
    try:
        parse_token(id_token)
    except HTTPException:
        return False
    return True


async def validate_return_path(return_path: str) -> None:
    """
    Validate the return path is one that we allow or raise an exception

    :raises ReturnPathValidationFailed: If the return path is not allowed
    """
    if not return_path.startswith(tuple(conf.AUTH_VALID_RETURN_PATH_PREFIXES)):
        raise ReturnPathValidationFailed("Invalid return_path")
