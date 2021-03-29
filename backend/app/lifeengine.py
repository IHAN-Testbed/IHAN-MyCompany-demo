from typing import Optional

import httpx

from app.log import logger


class LEClient:
    """
    Simple httpx wrapper for requests to Lifeengine that allows retrying etc.
    """

    # Use a shared httpx.AsyncClient() to be able to reuse the connection
    timeout = httpx.Timeout(5)
    client = httpx.AsyncClient(timeout=timeout)

    MAX_RETRIES = 5

    @classmethod
    async def request(
        cls,
        method: str,
        url: str,
        *,
        json: Optional[dict] = None,
        params: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> httpx.Response:
        """
        Do a request using httpx, but with retries
        """
        for attempt in range(1, cls.MAX_RETRIES + 1):
            try:
                return await cls.client.request(
                    method, url, json=json, params=params, headers=headers
                )
            except httpx.RequestError as ex:
                if method == "GET":
                    logger.info(
                        "Failed to make a request to LE, attempt {}/{}",
                        attempt,
                        cls.MAX_RETRIES,
                        url=url,
                        params=params,
                        err=ex.__class__.__name__,
                    )
                    if attempt < cls.MAX_RETRIES:
                        continue
                raise

    @classmethod
    async def get(
        cls,
        url: str,
        *,
        params: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> httpx.Response:
        return await cls.request("GET", url, params=params, headers=headers)

    @classmethod
    async def post(
        cls,
        url: str,
        *,
        json: Optional[dict] = None,
        params: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> httpx.Response:
        return await cls.request("POST", url, json=json, params=params, headers=headers)

    @classmethod
    async def put(
        cls,
        url: str,
        *,
        json: Optional[dict] = None,
        params: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> httpx.Response:
        return await cls.request("PUT", url, json=json, params=params, headers=headers)

    @classmethod
    async def delete(
        cls,
        url: str,
        *,
        params: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> httpx.Response:
        return await cls.request("DELETE", url, params=params, headers=headers)
