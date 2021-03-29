from datetime import datetime
from typing import Any, Dict, Optional

from firedantic import Model
from stringcase import camelcase


class Consent(Model):
    __collection__ = "consents"

    data: Dict[str, Any] = {}


class LoginState(Model):
    __collection__ = "loginState"

    expire: datetime
    returnPath: str
    nonce: str


class LogoutState(Model):
    __collection__ = "logoutState"

    expire: datetime
    redirect_target: str
    state: Optional[str]

    class Config:
        alias_generator = camelcase
        allow_population_by_field_name = True
