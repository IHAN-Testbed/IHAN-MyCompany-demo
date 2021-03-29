# ----- React build ----- #
FROM node:12-alpine AS mycompany-frontend

WORKDIR /src/frontend/my-company

ADD frontend/my-company/package.json frontend/my-company/yarn.lock ./
RUN apk add --no-cache util-linux \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
    && yarn install

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn add puppeteer@1.19.0

ADD frontend/my-company ./
RUN yarn run build

# ----- React build ----- #
FROM node:12-alpine AS accountant-frontend

WORKDIR /src/frontend/accountant

ADD frontend/accountant/package.json frontend/accountant/yarn.lock ./
RUN apk add --no-cache util-linux \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
    && yarn install

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn add puppeteer@1.19.0

ADD frontend/accountant ./
RUN yarn run build


# ----- Server build ----- #

FROM python:3.9.2-alpine3.13 AS mycompany-backend

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    WORKON_HOME="/.venv" \
    USER="api" \
    GROUP="api" \
    UID=1000 \
    GID=1000 \
    PYTHONUNBUFFERED=1 \
    POETRY_HOME="/usr/local/poetry" \
    POETRY_VERSION="1.1.4" \
    PATH="${PATH}:/.venv:/usr/local/poetry/bin"

# Run docker/build-prepare.sh
WORKDIR /src/backend
COPY libs/sh /src/libs/sh
COPY docker/build-prepare.sh /src/docker/build-prepare.sh
RUN sh /src/docker/build-prepare.sh

# Add minimal things for installing dependencies
USER ${USER}

# Run docker/build-setup.sh and install poetry dependencies
COPY docker/build-setup.sh /src/docker/build-setup.sh
COPY backend/pyproject.toml backend/poetry.lock ./
# GOTCHA: --chown= does not take env variables - so update this if you change user
RUN sh /src/docker/build-setup.sh


# ----- Runtime environment ----- #

FROM python:3.9.2-alpine3.13 AS mycompany-runtime

ENV ENV="development" \
    LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    WORKON_HOME="/.venv" \
    USER="api" \
    GROUP="api" \
    UID=1000 \
    GID=1000 \
    PYTHONUNBUFFERED=1 \
    POETRY_HOME="/usr/local/poetry" \
    POETRY_VERSION="1.1.4" \
    PARSE_TEMPLATE_VERSION="v1.0.0" \
    PARSE_TEMPLATE_HASH="8d1dc39e701b938f4874f3f8130cd3a324e7fa4697af36541918f9398dd61223" \
    PATH="${PATH}:/.venv:/usr/local/poetry/bin"

ARG DEVELOPMENT=0

RUN apk add --no-cache libstdc++ nginx curl apache2-utils \
    && curl -L -o /usr/bin/parse-template \
        https://github.com/cocreators-ee/parse-template/releases/download/${PARSE_TEMPLATE_VERSION}/parse-template-linux-amd64 \
    && echo "${PARSE_TEMPLATE_HASH}  /usr/bin/parse-template" | sha256sum -c \
    && chmod +x /usr/bin/parse-template

# Copy Nginx configs
RUN rm -rf /etc/nginx/conf.d /etc/nginx/http.d
COPY nginx/ /etc/nginx/

# Copy results from build environments
COPY --from=mycompany-frontend /src/frontend/my-company/build/ /src/frontend/my-company/
COPY --from=accountant-frontend /src/frontend/accountant/build/ /src/frontend/accountant/
COPY --from=mycompany-backend ${POETRY_HOME} ${POETRY_HOME}
COPY --from=mycompany-backend ${WORKON_HOME} ${WORKON_HOME}
COPY --from=mycompany-backend /src/libs /src/libs

# Run docker/runtime-prepare.sh
WORKDIR /src/backend
COPY \
    docker/runtime-prepare.sh \
    docker/runtime-entrypoint.sh \
    docker/nginx-entrypoint.sh \
    /src/docker/

# Copy all the backend code over
COPY backend ./
RUN sh /src/docker/runtime-prepare.sh

USER ${USER}
EXPOSE 8080
ENTRYPOINT ["sh", "/src/docker/runtime-entrypoint.sh"]
