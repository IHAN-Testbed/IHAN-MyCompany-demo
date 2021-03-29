from typing import List

from pydantic import AnyHttpUrl, BaseModel, BaseSettings, SecretStr


class FrontendSettings(BaseModel):
    path_prefix: str
    auth_error_page: str = "/auth-error"


class Settings(BaseSettings):
    PROJECT_NAME: str = "IHAN My Company demo app"
    GOOGLE_PROJECT_NAME: str = "my-project"
    DB_COLLECTION_PREFIX: str = ""
    ENV: str = "development"
    BASE_URL: AnyHttpUrl = "http://localhost:8000"

    COOKIE_SECURE: bool = False
    COOKIE_SIGNING_KEY: bytes = b"some secret key"
    COOKIE_AUTH_SIZE: int = 16

    LE_API_URL: AnyHttpUrl = "http://192.168.99.100:31000"
    LE_APP_TOKEN: str = "ey..."
    PRODUCT_GATEWAY_URL: AnyHttpUrl = "https://gateway.ihan.io"

    OPENID_CONNECT_CONFIGURATION: AnyHttpUrl = (
        "https://auth.sandbox.sisuid.com/.well-known/openid-configuration"
    )
    OPENID_CONNECT_CLIENT_ID: str = ""
    OPENID_CONNECT_CLIENT_SECRET: SecretStr = ""
    OPENID_CONNECT_ACR_VALUES: str = "mobileauth"
    OPENID_CONNECT_SCOPES: str = "openid profile linked_ids"
    OPENID_CONNECT_INCLUDE_ID_TOKEN_HINT_IN_LOGOUT: bool = False

    AUTH_VALID_RETURN_PATH_PREFIXES: set = {
        "/my-company/company-select",
        "/accountant/company-select",
    }

    FRONTEND_APPS: List[FrontendSettings] = [
        FrontendSettings(path_prefix="/my-company"),
        FrontendSettings(path_prefix="/accountant"),
    ]

    def is_local_env(self):
        return self.ENV == "development"


conf = Settings()
