import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)


class AppException(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
    if exc.status_code >= 500:
        logger.error("AppException: %s", exc.detail, exc_info=True)
    else:
        logger.error("AppException: %s", exc.detail)

    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, app_exception_handler)
