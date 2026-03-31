from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db_session
from app.schemas.mock import (
    MockEndpointCreate,
    MockEndpointResponse,
    MockEndpointUpdate,
    MockGenerationResult,
)
from app.services.mock_logic import (
    create_mock_endpoint,
    delete_mock_endpoint,
    get_mock_endpoint_by_id,
    list_mock_endpoints,
    update_mock_endpoint_description,
)


router = APIRouter(prefix="/api/v1/mocks", tags=["mocks"])


@router.post("", response_model=MockGenerationResult, status_code=status.HTTP_201_CREATED)
async def create_mock(
    request_data: MockEndpointCreate,
    db: AsyncSession = Depends(get_db_session),
) -> MockGenerationResult:
    endpoint, payload = await create_mock_endpoint(db, request_data)
    return MockGenerationResult(
        endpoint=MockEndpointResponse.model_validate(endpoint),
        payload=payload,
    )


@router.get("", response_model=list[MockEndpointResponse])
async def get_mocks(db: AsyncSession = Depends(get_db_session)) -> list[MockEndpointResponse]:
    endpoints = await list_mock_endpoints(db)
    return [MockEndpointResponse.model_validate(item) for item in endpoints]


@router.get("/{endpoint_id}", response_model=MockEndpointResponse)
async def get_mock_by_id(
    endpoint_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> MockEndpointResponse:
    endpoint = await get_mock_endpoint_by_id(db, endpoint_id)
    return MockEndpointResponse.model_validate(endpoint)


@router.patch("/{endpoint_id}", response_model=MockEndpointResponse)
async def patch_mock_description(
    endpoint_id: str,
    request_data: MockEndpointUpdate,
    db: AsyncSession = Depends(get_db_session),
) -> MockEndpointResponse:
    endpoint = await update_mock_endpoint_description(
        db=db,
        endpoint_id=endpoint_id,
        description=request_data.description,
    )
    return MockEndpointResponse.model_validate(endpoint)


@router.delete("/{endpoint_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_mock(
    endpoint_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> None:
    await delete_mock_endpoint(db, endpoint_id)
