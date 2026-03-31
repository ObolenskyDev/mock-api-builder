from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    DATABASE_URL: str = Field(..., description="PostgreSQL DSN (asyncpg)")
    REDIS_URL: str = Field(..., description="Redis URL")
    OPENAI_API_KEY: str = Field(..., description="OpenAI API key")
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        if not value.startswith("postgresql+asyncpg://"):
            raise ValueError("DATABASE_URL must start with 'postgresql+asyncpg://'")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
