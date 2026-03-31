from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class MockEndpointCreate(BaseModel):
    path: str = Field(..., examples=["users/profile"])
    method: str = Field(..., examples=["GET"])
    description: str = Field(..., min_length=5)

    @field_validator("path")
    @classmethod
    def normalize_path(cls, value: str) -> str:
        return value.strip().strip("/")

    @field_validator("method")
    @classmethod
    def normalize_method(cls, value: str) -> str:
        return value.strip().upper()


class MockEndpointUpdate(BaseModel):
    description: str = Field(..., min_length=5)


class MockEndpointResponse(BaseModel):
    id: UUID
    path: str
    method: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MockGenerationResult(BaseModel):
    endpoint: MockEndpointResponse
    payload: dict[str, Any]
