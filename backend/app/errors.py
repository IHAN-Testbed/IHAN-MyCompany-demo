from typing import Any

from fastapi import HTTPException


class ReturnPathValidationFailed(HTTPException):
    def __init__(self, detail: Any = None):
        super().__init__(status_code=400, detail=detail)


class SignatureVerificationFailed(HTTPException):
    def __init__(self, detail: Any = None):
        super().__init__(status_code=400, detail=detail)


class AuthException(Exception):
    """
    Authentication related exception that should be handled by redirecting the user to
    the frontend side error page with details included in query parameters.
    """

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
