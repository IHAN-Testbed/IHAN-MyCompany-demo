from enum import Enum
from typing import Optional, Set
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.api import (
    IdentityPost,
    IdentityResponse,
    LinkListResponse,
    LinkPost,
    LinkResponse,
)
from app.auth import User, get_logged_in_user
from app.lifeengine import LEClient
from settings import conf

LE_IDENTITY_API = f"{conf.LE_API_URL}/identities/v1"

router = APIRouter()

client = LEClient


class LinkDirection(str, Enum):
    IN = "in"
    OUT = "out"


def _raise_error(response: httpx.Response, expected_codes: Optional[Set[int]] = None):
    """
    Handle raising of errors based on response from LE. If the error code is an expected
    code, then pass on the error code as is and retrieve the message from LE. If the
    error was unexpected send a 502 with raw upstreamError.
    """
    error_details = {"upstreamError": response.text}
    status_code = 502
    try:
        if expected_codes and response.status_code in expected_codes:
            error_details = response.json().get("error", {}).get("message")
            status_code = response.status_code
        else:
            error_details = {"upstreamError": response.json()}
    finally:
        raise HTTPException(status_code=status_code, detail=error_details)


@router.post(
    "/",
    summary="Create identity",
    tags=["identities"],
    response_model=IdentityResponse,
    status_code=201,
)
async def create_identity(
    identity: IdentityPost, user: User = Depends(get_logged_in_user)
):
    """
    Create a new identity
    """
    response = await client.post(
        f"{LE_IDENTITY_API}/",
        json=identity.dict(),
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )
    if response.status_code != 201:
        _raise_error(response)

    return response.json()


@router.get(
    "/{identity_id}",
    summary="Read identity",
    tags=["identities"],
    response_model=IdentityResponse,
)
async def read_identity(identity_id: UUID, user: User = Depends(get_logged_in_user)):
    """
    Read an identity
    """
    response = await client.get(
        f"{LE_IDENTITY_API}/{identity_id}",
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 200:
        _raise_error(response, expected_codes={404})

    return response.json()


@router.put(
    "/{identity_id}",
    summary="Update identity",
    tags=["identities"],
    response_model=IdentityResponse,
)
async def update_identity(
    identity: IdentityPost,
    identity_id: UUID,
    user: User = Depends(get_logged_in_user),
):
    """
    Update an identity
    """
    response = await client.put(
        f"{LE_IDENTITY_API}/{identity_id}",
        json=identity.dict(),
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 200:
        _raise_error(response, expected_codes={404})

    return response.json()


@router.delete(
    "/{identity_id}", summary="Delete identity", tags=["identities"], status_code=204
)
async def delete_identity(identity_id: UUID, user: User = Depends(get_logged_in_user)):
    """
    Delete an identity
    """
    response = await client.delete(
        f"{LE_IDENTITY_API}/{identity_id}",
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 204:
        _raise_error(response, expected_codes={403, 404})


@router.get(
    "/{identity_id}/links/{direction}",
    summary="List in/out links for an identity",
    tags=["identities"],
    response_model=LinkListResponse,
)
async def list_links(
    identity_id: UUID,
    direction: LinkDirection,
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
    link_type: Optional[str] = Query(None, alias="type"),
    user: User = Depends(get_logged_in_user),
):
    """
    List in/out links for an identity
    """
    response = await client.get(
        f"{LE_IDENTITY_API}/{identity_id}/links/{direction}",
        params={"limit": limit, "offset": offset, "type": link_type},
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 200:
        _raise_error(response, expected_codes={404})

    return response.json()


@router.post(
    "/{from_identity}/link/{to_identity}",
    summary="Create link",
    tags=["identities"],
    response_model=LinkResponse,
)
async def create_link(
    from_identity: UUID,
    to_identity: UUID,
    link: LinkPost,
    user: User = Depends(get_logged_in_user),
):
    """
    Create a link between two identities
    """
    response = await client.post(
        f"{LE_IDENTITY_API}/{from_identity}/link/{to_identity}",
        json={"type": link.type, "data": link.data},
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 201:
        _raise_error(response, expected_codes={403, 404, 409})

    return response.json()


@router.get(
    "/{from_identity}/link/{to_identity}/{type}",
    summary="Get link",
    tags=["identities"],
    response_model=LinkResponse,
)
async def read_link(
    from_identity: UUID,
    to_identity: UUID,
    link_type: str = Path(..., alias="type"),
    user: User = Depends(get_logged_in_user),
):
    """
    Read a link between two identities
    """
    response = await client.get(
        f"{LE_IDENTITY_API}/{from_identity}/link/{to_identity}/{link_type}",
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 200:
        _raise_error(response, expected_codes={404})

    return response.json()


@router.put(
    "/{from_identity}/link/{to_identity}/{type}",
    summary="Update link",
    tags=["identities"],
    response_model=LinkResponse,
)
async def update_link(
    from_identity: UUID,
    to_identity: UUID,
    link: LinkPost,
    link_type: str = Path(..., alias="type"),
    user: User = Depends(get_logged_in_user),
):
    """
    Update a link between two identities
    """
    response = await client.put(
        f"{LE_IDENTITY_API}/{from_identity}/link/{to_identity}/{link_type}",
        json={"type": link.type, "data": link.data},
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 200:
        _raise_error(response, expected_codes={403, 404, 409})

    return response.json()


@router.delete(
    "/{from_identity}/link/{to_identity}/{type}",
    summary="Delete link",
    tags=["identities"],
    status_code=204,
)
async def delete_link(
    from_identity: UUID,
    to_identity: UUID,
    link_type: str = Path(..., alias="type"),
    user: User = Depends(get_logged_in_user),
):
    """
    Delete a link between two identities
    """
    response = await client.delete(
        f"{LE_IDENTITY_API}/{from_identity}/link/{to_identity}/{link_type}",
        headers={"Authorization": f"Bearer {conf.LE_APP_TOKEN}"},
    )

    if response.status_code != 204:
        _raise_error(response, expected_codes={403, 404})
