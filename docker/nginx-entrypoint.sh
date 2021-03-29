#!/usr/bin/env sh

# Wait until backend socket is created. Start Nginx only after that to avoid 502s
# 20 sec = 20 * (20 / 0.05)
MAX_TRIES=8000
for i in $(seq 1 "${MAX_TRIES}")
do
  if [ $((i % 20)) = 0 ]; then
    echo "Waiting for backend to start (${i}/${MAX_TRIES}) .."
  fi
  RES=0
  curl --unix-socket /run/nginx/uvicorn.sock http://localhost/api/health > /dev/null 2>&1 || RES=$?
  # break if the backend has responded. backend is now ready to handle requests
  if [ ${RES} -eq 0 ]; then
    break
  else
    sleep 0.05
  fi
  # exit if backend is not responding after MAX_TRIES attempts
  if [ "${i}" = "${MAX_TRIES}" ]; then
    killall uvicorn
    exit 1
  fi
done

# Create HTTP Basic Auth credentials. It won't be used if HTTP_BASIC_AUTH_USER is empty
if [ -n "${HTTP_BASIC_AUTH_USER:-""}" ]; then
  htpasswd -b -c /run/nginx/.htpasswd "${HTTP_BASIC_AUTH_USER}" "${HTTP_BASIC_AUTH_PASSWORD}"
  export HTTP_BASIC_AUTH_REALM=${HTTP_BASIC_AUTH_REALM:-"Private area"}
  echo "Created HTTP Basic Auth credentials for ${HTTP_BASIC_AUTH_REALM}"
fi

# Update Nginx conf with environment variables.
# It is critical this is done at RUNTIME, not build-time, as PORT may change.
parse-template /etc/nginx/conf.d/default.conf > /tmp/conf && \
  cat /tmp/conf > /etc/nginx/conf.d/default.conf && rm /tmp/conf

set -x

echo "Starting Nginx at port ${PORT}"
# Launch nginx and relinquish control
nginx -g "daemon off;"

echo "Nginx has stopped. Exiting"
# It's important to omit "set -euo pipefail" so when error occurs, container will exit
killall uvicorn
