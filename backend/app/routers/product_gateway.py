import httpx
from fastapi import APIRouter, HTTPException
from fastapi.requests import Request
from fastapi.responses import JSONResponse, Response
from httpx import HTTPError

from app.log import logger
from settings import conf

router = APIRouter()
timeout = httpx.Timeout(30)
client = httpx.AsyncClient(timeout=timeout)


@router.post("/{data_product:path}", tags=["data_product"])
async def route_identities(data_product: str, request: Request) -> Response:
    url = f"{conf.PRODUCT_GATEWAY_URL}/{data_product}"
    if request.url.query:
        url += f"?{request.url.query}"
    json_payload = await request.json()
    logger.debug("Fetching Data Product", url=url)
    try:
        resp = await client.post(url, json=json_payload)
    except HTTPError:
        logger.exception("Failed to fetch Data Product from the Product Gateway")
        raise HTTPException(status_code=502)
    return JSONResponse(resp.json(), status_code=resp.status_code)
