#!/usr/bin/env sh
#
# This step is for initializing the runtime environment
#

# shellcheck disable=SC2039
set -exuo pipefail

# Runtime dependencies
apk add xmlsec \
    libxml2 \
    curl \
    libxslt

# Add group for our user
addgroup -g "${GID}" -S "${GROUP}"

# Development build?
if [ "${DEVELOPMENT:-0}" = "1" ]; then
  # Add user, with wheel access
  adduser -u "${UID}" -S "${USER}" -G "${GROUP}" -G wheel -D

  # Install packages useful for development
  apk add sudo

  # edit /etc/sudoers and delete comment at the %wheel.
  sed -e 's;^# \(%wheel.*NOPASSWD.*\);\1;g' -i /etc/sudoers

  # Lock out root account and delete password
  passwd -d root
else
  # Add user
  adduser -u "${UID}" -S "${USER}" -G "${GROUP}" -D
fi

# Enable su to $USER
sed -i -E "s@${USER}:(.*):/sbin/nologin@${USER}:\1:/bin/ash@" /etc/passwd

# Allow ${USER} to edit contents while installing things
chown -R "${USER}":"${GROUP}" .

# Poetry configuration
su "${USER}" -c "poetry config virtualenvs.in-project false"
su "${USER}" -c "poetry config virtualenvs.path ${WORKON_HOME}"

# Set up PYTHONPATH for the "app" package. Only this module will be installed
if [[ "${DEVELOPMENT:-0}" == "1" ]]; then
  su "${USER}" -c ". ${POETRY_HOME}/env; poetry install"
else
  su "${USER}" -c ". ${POETRY_HOME}/env; poetry install --no-dev"
fi

if [ "${DEVELOPMENT:-0}" = "0" ]; then
  # Ensure user cannot edit the filesystem contents
  chown -R root:root /src
fi

# Prepare nginx
# This is where logs will be stored. It should be accessible by ${USER}
mkdir /run/nginx
chown -R "${USER}:${GROUP}" /run/nginx
# Make /var/lib/nginx/logs/error.log be accessible by ${USER}
# Somehow it's still being created, however `error_log` is set
chown -R "${USER}:${GROUP}" /var/lib/nginx /var/log/nginx
# Forward nginx errors to stderr
ln -sf /dev/stderr /run/nginx/error.log
# Prevent parse-template from failing with permission error at runtime
chown "${USER}:${GROUP}" /etc/nginx/conf.d/default.conf

# Cleanup
rm -rf /src/libs
