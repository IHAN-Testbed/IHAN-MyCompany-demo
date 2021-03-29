from uuid import UUID

from fastapi import APIRouter, Depends, Path
from firedantic import ModelNotFoundError

from app.api import ConsentRequestResponse
from app.auth import User, get_logged_in_user
from app.models import Consent

router = APIRouter()


@router.get(
    "/from/{from}/to/{to}",
    summary="Check consent",
    response_model=ConsentRequestResponse,
    tags=["consents"],
)
async def get_consent(
    from_: UUID = Path(..., alias="from"),
    to: UUID = Path(...),
    user: User = Depends(get_logged_in_user),
):
    """
    Check if a consent is granted or not.
    """
    consent_id = get_consent_id(from_, to)
    try:
        consent = Consent.get_by_id(consent_id)
    except ModelNotFoundError:
        consent = Consent(id=consent_id)
    return consent


@router.post(
    "/from/{from}/to/{to}",
    summary="Update consent",
    response_model=ConsentRequestResponse,
    tags=["consents"],
)
async def update_consent(
    params: ConsentRequestResponse,
    from_: UUID = Path(..., alias="from"),
    to: UUID = Path(...),
    user: User = Depends(get_logged_in_user),
):
    """
    Create or update a consent.
    """
    consent_id = get_consent_id(from_, to)
    consent = Consent(id=consent_id, **params.dict())
    consent.save()

    return consent


def get_consent_id(from_: UUID, to: UUID) -> str:
    """
    Turn the from ID and to id into a string that can be used as a key in Firebase.
    """
    return f"{from_}_{to}"
