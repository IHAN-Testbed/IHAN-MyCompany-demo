from datetime import datetime, timezone
from hashlib import blake2b
from hmac import compare_digest
from typing import Optional

from fastapi import Request, Response

from app.errors import SignatureVerificationFailed
from settings import FrontendSettings, conf

# Utilities that depend on the app


COOKIE_SEPARATOR = "###"


def set_cookie(
    response: Response,
    key: str,
    value: str,
    max_age: Optional[int] = None,
    path="/",
    http_only=True,
    samesite="Strict",
):
    """
    Store a cookie
    """
    secure = conf.COOKIE_SECURE
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        path=path,
        httponly=http_only,
        secure=secure,
        samesite=samesite,
    )


def set_signed_cookie(
    response: Response, key: str, value: str, max_age: int, path="/", http_only=True
):
    """
    Store and sign a cookie
    """
    value = make_signed_value(key, value)
    set_cookie(response, key, value, max_age, path, http_only)


def make_signed_value(key: str, value: str):
    """
    Generate value###sign signed pair from a given text value
    """
    signature = get_signature(key, value)

    return f"{value}{COOKIE_SEPARATOR}{signature}"


def verify_signed_cookie(key: str, value: str) -> str:
    """
    Check that value###sign is signed with out key
    """
    value, signature = value.rsplit(COOKIE_SEPARATOR, 1)
    verify = get_signature(key, value)
    if not compare_digest(verify.encode("utf-8"), signature.encode("utf-8")):
        raise SignatureVerificationFailed(
            f"Could not verify signature for cookie {key}"
        )

    return value


def get_signature(key: str, value: str) -> str:
    """
    Generate signature for verifying cookies
    """
    payload = f"{key}{COOKIE_SEPARATOR}{value}"
    h = blake2b(digest_size=conf.COOKIE_AUTH_SIZE, key=conf.COOKIE_SIGNING_KEY)
    h.update(payload.encode("utf-8"))
    return h.hexdigest()


def rfc3339() -> str:
    """Gets the current datetime in UTC iso formatted string.

    E.g. "2019-01-01T12:00:00+00:00"

    :return: The current UTC datetime in ISO format.
    :rtype: str
    """
    return str(datetime.now(timezone.utc).isoformat(timespec="seconds"))


def get_frontend_settings_by_path(path_prefix: str) -> FrontendSettings:
    """
    Get the Frontend Settings for a frontend by it's path_prefix
    """
    frontend_settings_by_path = {f.path_prefix: f for f in conf.FRONTEND_APPS}
    return frontend_settings_by_path[path_prefix]


def url_for(req: Request, name: str, **kwargs) -> str:
    """
    Get the URL for a route, absolute with our own BASE_URL
    """
    relative_url = req.scope["router"].url_path_for(name, **kwargs)
    return f"{str(conf.BASE_URL).rstrip('/')}{relative_url}"
