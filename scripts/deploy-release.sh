#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/superclaw101}"
RELEASE_ID="${RELEASE_ID:?RELEASE_ID is required}"
UPLOAD_ROOT="${UPLOAD_ROOT:?UPLOAD_ROOT is required}"
RELEASE_DIR="${APP_ROOT}/releases/${RELEASE_ID}"
CURRENT_LINK="${APP_ROOT}/current"
DIST_SOURCE="${UPLOAD_ROOT}/dist"

if [ ! -d "${DIST_SOURCE}" ]; then
  echo "dist source not found: ${DIST_SOURCE}" >&2
  exit 1
fi

mkdir -p "${APP_ROOT}/releases" "${APP_ROOT}/shared"
rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}"
cp -a "${DIST_SOURCE}/." "${RELEASE_DIR}/"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}"
nginx -t
systemctl reload nginx

echo "Activated release ${RELEASE_ID} at ${RELEASE_DIR}"
