from base64 import b64decode
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from uuid import uuid4

import httpx
import jwt
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.x509 import load_der_x509_certificate
from fastapi import Cookie, HTTPException
from firedantic import ModelNotFoundError
from pydantic import BaseModel, Field

from app.api import OpenIDConfiguration
from app.log import logger
from app.models import LoginState, LogoutState
from settings import conf
from utils import urlsafe_b64_to_unsigned_int

JWT_KEYS = {}


class User(BaseModel):
    id: str = Field(
        ..., title="User's pairwise ID", example="7f648110-505d-4960-868a-3dfdf0599cad"
    )


class Token(BaseModel):
    class Config:
        extra = "ignore"  # as per OpenID Connect specification

    iss: str = Field(..., title="Issuer Identifier")
    sub: str = Field(..., title="Subject identifier - User ID")
    aud: str = Field(..., title="Audience(s)")
    exp: int = Field(..., title="Expiration unix timestamp")
    iat: int = Field(..., title="Issued at unix timestamp")
    auth_time: Optional[int] = Field(None, title="Time of authentication")
    nonce: str = Field(..., title="Unique authentication nonce")
    acr: Optional[str] = Field(None, title="Authentication Context Class")
    amr: Optional[List[str]] = Field(None, title="Authentication Methods")
    azp: Optional[str] = Field(None, title="Authorized party")


class OpenIDConfigurationHandler:
    """
    Class to fetch the OpenIDConfiguration once and then return the cached copy.
    """

    def __init__(self):
        self.conf: Optional[OpenIDConfiguration] = None

    async def fetch(self, client: httpx.AsyncClient) -> None:
        """
        Fetch the OpenID Configuration and store it for later use.
        """
        url = conf.OPENID_CONNECT_CONFIGURATION
        logger.info("Fetching OpenID Configuration", url=url)
        response = await client.get(url)
        self.conf = OpenIDConfiguration(**response.json())

    def __getattr__(self, item):
        return getattr(self.conf, item)


openid_conf = OpenIDConfigurationHandler()


def generate_nonce() -> str:
    return str(uuid4())


def parse_token(id_token: Optional[str]) -> User:
    if not id_token:
        raise HTTPException(401, "User not logged in")

    try:
        token = validate_token(id_token=id_token)
    except jwt.exceptions.InvalidTokenError:
        raise HTTPException(401, "User not logged in")

    return User(id=token.sub)


def _get_key_entry(id_token: str) -> dict:
    """
    Get a cached entry from JWT_KEYS containing the "algorithm" and "key" based on the
    key ID (kid) found in the given id_token.
    raise: jwt.exceptions.InvalidTokenError If token is missing Key ID or Key ID is not
    found in the mapping.
    """
    jwt_headers = jwt.get_unverified_header(id_token)
    try:
        kid = jwt_headers["kid"]
    except KeyError:
        raise jwt.exceptions.InvalidTokenError("Key ID header missing")

    try:
        key_entry = JWT_KEYS[kid]
    except KeyError:
        raise jwt.exceptions.InvalidTokenError("Key ID header is invalid")

    return key_entry


def validate_token(id_token: str) -> Token:
    """
    Validate an id_token
    raise: jwt.exceptions.InvalidTokenError If token is invalid
    """
    key_entry = _get_key_entry(id_token=id_token)
    token = Token(
        **jwt.decode(
            id_token,
            verify=True,
            audience=conf.OPENID_CONNECT_CLIENT_ID,
            issuer=openid_conf.issuer,
            **key_entry,
        )
    )

    return token


def generate_state(return_path: str, nonce: str) -> str:
    """
    Generate a new state and store it in the database.
    """
    state = str(uuid4())
    ls = LoginState(
        id=state,
        expire=datetime.now(timezone.utc) + timedelta(hours=24),
        returnPath=return_path,
        nonce=nonce,
    )
    ls.save()
    return state


def generate_logout_state(redirect_target: str, state: Optional[str] = None) -> str:
    """
    Generate a new logout state and store it in the database.
    """
    state_id = str(uuid4())
    ls = LogoutState(
        id=state_id,
        expire=datetime.now(timezone.utc) + timedelta(hours=24),
        redirect_target=redirect_target,
        state=state,
    )
    ls.save()
    return state_id


def get_valid_state(state: str) -> Optional[LoginState]:
    """
    Try to find a state in the database and verify it's still valid; return either None
    or the valid LoginState
    """
    try:
        ls = LoginState.get_by_id(state)
    except ModelNotFoundError:
        return None

    ls.delete()

    if ls.expire < datetime.now(timezone.utc):
        return None

    return ls


async def get_logged_in_user(id_token: str = Cookie(None)) -> User:
    """
    Get the currently logged in user; can be used as a dependency to require a user to
    be authenticated.
    """
    if not id_token:
        raise HTTPException(401, "Authentication required")

    return parse_token(id_token)


async def fetch_keys(client: httpx.AsyncClient) -> None:
    """
    Fetch JWT keys and store them in the JWT_KEYS that will act as a cache.
    """
    # TODO: Handling of the JWKS should be refactored to a separate library and it
    #  should make sure the caching + fetching fresh data is implemented according to
    #  standards. This simplified version now caches the keys forever (= until restart).
    url = openid_conf.jwks_uri

    logger.info("Fetching JWKS", url=url)

    response = await client.get(url)
    key_data = response.json()
    for entry in key_data["keys"]:
        kid = entry["kid"]
        algorithm = entry["alg"]
        if entry.get("kty") == "RSA" and "n" in entry and "e" in entry:
            n = urlsafe_b64_to_unsigned_int(entry["n"])
            e = urlsafe_b64_to_unsigned_int(entry["e"])
            key = RSAPublicNumbers(e=e, n=n).public_key(default_backend())
        else:
            key = load_der_x509_certificate(
                b64decode(entry["x5c"][0]), default_backend()
            ).public_key()
        JWT_KEYS[kid] = {
            "algorithm": algorithm,
            "key": key,
        }
        logger.info(
            "Added JWT key", kid=kid, algorithm=algorithm, type=type(key).__name__
        )
