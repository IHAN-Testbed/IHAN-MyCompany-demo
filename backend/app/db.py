import uuid
from os import environ

import google.auth.credentials
from firedantic.configurations import configure
from google.cloud import firestore
from mock import Mock

from settings import conf


def _make_credentials() -> Mock:
    return Mock(spec=google.auth.credentials.Credentials)


def get_db() -> firestore.Client:
    """Returns the database client.

    :return: Firestore client.
    """
    if environ.get("FIRESTORE_EMULATOR_HOST"):
        return firestore.Client(
            project=conf.GOOGLE_PROJECT_NAME, credentials=_make_credentials()
        )
    else:
        return firestore.Client()


def get_prefix() -> str:
    """Returns the prefix for the database collection.

    :return: The prefix.
    """
    prefix = ""
    if conf.DB_COLLECTION_PREFIX:
        prefix += f"{conf.DB_COLLECTION_PREFIX}-"
    if conf.ENV == "unittest":
        prefix += f"unittest-{uuid.uuid4()}-"

    return prefix


def configure_db() -> None:
    configure(get_db(), get_prefix())
