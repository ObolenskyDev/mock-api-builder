from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app.api.setup import setup_routers
from app.core.exceptions import register_exception_handlers
from app.core.logger import setup_logging
from app.db.database import async_engine, redis_client
from app.db.models import Base


@asynccontextmanager
async def lifespan(_: FastAPI):
    setup_logging()

    async with async_engine.begin() as connection:
        await connection.execute(text("SELECT 1"))
        await connection.run_sync(Base.metadata.create_all)

    await redis_client.ping()

    try:
        yield
    finally:
        await redis_client.aclose()
        await async_engine.dispose()


app = FastAPI(
    title="AI-Generated Mock API Builder",
    version="0.1.0",
    lifespan=lifespan,
)

register_exception_handlers(app)
setup_routers(app)


@app.get("/healthz", tags=["health"])
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
