import pytest

from app.errors import SignatureVerificationFailed
from app.utils import make_signed_value, verify_signed_cookie


def test_cookies():
    key = "login"
    value = "username"

    signed = make_signed_value(key, value)
    assert verify_signed_cookie(key, signed) == value

    with pytest.raises(SignatureVerificationFailed):
        verify_signed_cookie(key, signed + "2")

    with pytest.raises(SignatureVerificationFailed):
        verify_signed_cookie(key + "2", signed)
