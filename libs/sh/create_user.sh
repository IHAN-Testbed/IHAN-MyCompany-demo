#!/usr/bin/env sh

# shellcheck disable=SC2039
set -exuo pipefail

# Create user
addgroup -g "${GID}" -S "${GROUP}"
adduser -u "${UID}" -s /bin/sh -S "${USER}" -G "${GROUP}" -G wheel -D

# Allow su - user
sed -i -E "s@${USER}:(.*):/sbin/nologin@${USER}:\1:/bin/ash@" /etc/passwd
