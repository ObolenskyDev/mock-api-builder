import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.db.database import redis_client
from app.db.models import MockEndpoint
from app.schemas.mock import MockEndpointCreate
from app.services.generator import generate_mock_json


def build_cache_key(method: str, path: str) -> str:
    clean_path = path.strip().strip("/")
    return f"mock_api:{method.upper()}:{clean_path}"


async def create_mock_endpoint(
    db: AsyncSession,
    payload: MockEndpointCreate,
) -> tuple[MockEndpoint, dict[str, Any]]:
    generated_payload = await generate_mock_json(payload.description)

    endpoint = MockEndpoint(
        path=payload.path,
        method=payload.method,
        description=payload.description,
    )
    db.add(endpoint)

    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise AppException(
            status_code=409,
            detail=f"Mock endpoint already exists for {payload.method} /m/{payload.path}",
        ) from exc

    await db.refresh(endpoint)

    cache_key = build_cache_key(payload.method, payload.path)
    await redis_client.set(cache_key, json.dumps(generated_payload))
    return endpoint, generated_payload


async def list_mock_endpoints(db: AsyncSession) -> list[MockEndpoint]:
    result = await db.execute(select(MockEndpoint).order_by(MockEndpoint.created_at.desc()))
    return list(result.scalars().all())


async def get_mock_endpoint_by_id(db: AsyncSession, endpoint_id: str) -> MockEndpoint:
    endpoint = await db.get(MockEndpoint, endpoint_id)
    if endpoint is None:
        raise AppException(status_code=404, detail="Mock endpoint not found")
    return endpoint


async def update_mock_endpoint_description(
    db: AsyncSession,
    endpoint_id: str,
    description: str,
) -> MockEndpoint:
    endpoint = await get_mock_endpoint_by_id(db, endpoint_id)
    endpoint.description = description
    await db.commit()
    await db.refresh(endpoint)
    return endpoint


async def delete_mock_endpoint(db: AsyncSession, endpoint_id: str) -> None:
    endpoint = await get_mock_endpoint_by_id(db, endpoint_id)
    cache_key = build_cache_key(endpoint.method, endpoint.path)
    await redis_client.delete(cache_key)
    await db.delete(endpoint)
    await db.commit()
