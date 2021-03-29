#!/usr/bin/env sh
#
# WARNING!
# ========
#
# THIS FILE IS NOT USED IN RUNTIME, ONLY WHILE BUILDING DOCKER IMAGES
# DO NOT ADD ANYTHING RUNTIME OR ENVIRONMENT SPECIFIC HERE
#
# This file is for installing the larger dependencies that rarely change such
# as OS packages, utilities and so on, for the build environment
#

# shellcheck disable=SC2039
set -exuo pipefail

sh /src/libs/sh/create_user.sh

# Install dependencies
apk add --update --no-cache --virtual build-dependencies \
    python3-dev \
    build-base \
    linux-headers \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    git \
    libffi-dev \
    openssl-dev \
    curl \
    libxml2 \
    libxml2-dev \
    libxslt \
    libxslt-dev \
    xmlsec \
    xmlsec-dev \
    cython \
    cmake

sh /src/libs/sh/prepare_workon_dir.sh
sh /src/libs/sh/install_poetry.sh

# Allow the next script to run as ${USER}
chown -R "${USER}":"${GROUP}" /src
