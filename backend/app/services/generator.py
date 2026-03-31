import json
import logging
from typing import Any

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.exceptions import AppException


logger = logging.getLogger(__name__)
settings = get_settings()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_mock_json(description: str) -> dict[str, Any]:
    prompt = (
        "Generate only a valid JSON object for a mock API response.\n"
        "Do not include markdown, comments, or explanations.\n"
        f"Description: {description}"
    )

    try:
        response = await client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
            temperature=0.2,
        )
        return json.loads(response.output_text.strip())
    except json.JSONDecodeError as exc:
        logger.error("OpenAI returned invalid JSON", exc_info=True)
        raise AppException(status_code=502, detail="Generator returned invalid JSON") from exc
    except Exception as exc:  # noqa: BLE001
        logger.error("OpenAI request failed", exc_info=True)
        raise AppException(status_code=502, detail="Failed to generate mock payload") from exc
