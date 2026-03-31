# Pinned distro (bookworm) reduces surprise upgrades; retry helps flaky mirrors/proxies.
FROM python:3.11-slim-bookworm AS build-stage

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN set -ux; \
    for attempt in 1 2 3; do \
      apt-get update && \
      apt-get install -y --no-install-recommends build-essential && \
      rm -rf /var/lib/apt/lists/* && \
      exit 0; \
      sleep 15; \
    done; \
    exit 1

COPY requirements.txt .
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install -r requirements.txt


FROM python:3.11-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# No apt in runtime: avoids flaky Debian mirror/proxy during docker build.
# Healthcheck uses Python stdlib instead of curl.
RUN useradd --create-home --shell /usr/sbin/nologin appuser

COPY --from=build-stage /opt/venv /opt/venv
COPY app ./app

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/healthz')"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
