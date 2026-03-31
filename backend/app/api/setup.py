from fastapi import FastAPI

from app.api.routers.catch_all import router as catch_all_router
from app.api.routers.management import router as management_router


def setup_routers(app: FastAPI) -> None:
    app.include_router(management_router)
    app.include_router(catch_all_router)
