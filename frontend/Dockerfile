FROM node:20-alpine AS build-stage

ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000

WORKDIR /app

# Do not rely on optional COPY of package-lock.json (Docker fails if glob matches nothing).
# Resolve exact versions into a lockfile, then install with npm ci (deterministic tree).
COPY package.json ./
RUN npm install --package-lock-only --no-audit --no-fund \
    && npm ci --no-audit --no-fund

COPY . .
RUN npm run build


FROM nginx:stable-alpine AS runtime

# Убрать дефолтную страницу образа (иначе при сбое COPY виден "Welcome to nginx!")
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
