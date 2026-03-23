#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/superclaw101}"
APP_DOMAIN="${APP_DOMAIN:-superclaw.opencaio.cn}"
EXPECT_RELEASE_ID="${EXPECT_RELEASE_ID:?EXPECT_RELEASE_ID is required}"
CURRENT_LINK="${APP_ROOT}/current"
EXPECTED_TARGET="${APP_ROOT}/releases/${EXPECT_RELEASE_ID}"

if [ ! -L "${CURRENT_LINK}" ]; then
  echo "current symlink is missing: ${CURRENT_LINK}" >&2
  exit 1
fi

REAL_TARGET="$(readlink -f "${CURRENT_LINK}")"
EXPECTED_REAL_TARGET="$(readlink -f "${EXPECTED_TARGET}")"

if [ "${REAL_TARGET}" != "${EXPECTED_REAL_TARGET}" ]; then
  echo "current release mismatch: ${REAL_TARGET} != ${EXPECTED_REAL_TARGET}" >&2
  exit 1
fi

if [ ! -f "${CURRENT_LINK}/index.html" ]; then
  echo "index.html missing under current release" >&2
  exit 1
fi

nginx -t
systemctl is-active --quiet nginx
curl --fail --silent --show-error --head "https://${APP_DOMAIN}" >/dev/null

echo "Deployment verification passed for ${EXPECT_RELEASE_ID}"
