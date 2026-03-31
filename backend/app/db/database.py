from collections.abc import AsyncGenerator

from redis.asyncio import Redis
from redis.asyncio import from_url as redis_from_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings


settings = get_settings()

async_engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

redis_client: Redis = redis_from_url(settings.REDIS_URL, decode_responses=True)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
