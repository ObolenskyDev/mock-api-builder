import json

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException
from app.db.database import redis_client
from app.services.mock_logic import build_cache_key


router = APIRouter(tags=["mock-runtime"])


# Exclude from OpenAPI: one handler + many methods otherwise duplicate operation_id in /openapi.json
@router.api_route(
    "/m/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    include_in_schema=False,
)
async def serve_mock_response(path: str, request: Request) -> JSONResponse:
    method = request.method.upper()
    cache_key = build_cache_key(method, path)

    data = await redis_client.get(cache_key)
    if data is None:
        raise AppException(status_code=404, detail=f"Mock not found for {method} /m/{path}")

    return JSONResponse(content=json.loads(data))
