from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import AnyUrl, BaseModel, Field


class HealthResponse(BaseModel):
    ok: bool
    ts: str


class ConsentRequestResponse(BaseModel):
    data: Dict[str, Any]


class IdentityPost(BaseModel):
    type: str = Field(...)
    data: Dict[str, Any]


class IdentityResponse(BaseModel):
    id: UUID
    type: str
    data: Optional[Dict[str, Any]]
    metadata: Optional[Dict[str, str]]


class LinkPost(BaseModel):
    type: str
    data: Optional[Dict[str, Any]] = None


class LinkResponse(BaseModel):
    id: UUID
    type: str
    from_id: UUID = Field(..., alias="from")
    to_id: UUID = Field(..., alias="to")
    data: Dict[str, Any]
    metadata: Dict[str, str]


class LinkListResponse(BaseModel):
    links: List[LinkResponse]


class UserData(BaseModel):
    name: str


class MeResponse(BaseModel):
    id: str
    name: str


class StartLoginRequest(BaseModel):
    returnPath: str = Field(...)
    frontendPath: str = ""


class StartLoginResponse(BaseModel):
    redirectUri: str = Field(...)


class OpenIDConfiguration(BaseModel):
    issuer: AnyUrl
    authorization_endpoint: AnyUrl
    token_endpoint: AnyUrl
    jwks_uri: AnyUrl
    userinfo_endpoint: AnyUrl
    end_session_endpoint: AnyUrl
