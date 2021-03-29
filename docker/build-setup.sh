#!/usr/bin/env sh
#
# WARNING!
# ========
#
# THIS FILE IS NOT USED IN RUNTIME, ONLY WHILE BUILDING DOCKER IMAGES
# DO NOT ADD ANYTHING RUNTIME OR ENVIRONMENT SPECIFIC HERE
#

# shellcheck disable=SC2039
set -exuo pipefail

# Don't install "app" package during this phase, cause the source code is not copied yet
sed -i 's/^packages =.*$//g' /src/backend/pyproject.toml

poetry install --no-dev
