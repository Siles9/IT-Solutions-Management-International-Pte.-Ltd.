#!/bin/sh
# Container entrypoint: bring the schema up to date, then hand over to the application.
# The application itself seeds an empty database on startup (see SeedService), which keeps
# the seeding logic in one place and makes a single-service deployment on Render/Railway work.
set -eu

echo "[entrypoint] waiting for PostgreSQL and applying migrations..."

attempt=1
max_attempts=30

until ./node_modules/.bin/prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[entrypoint] migrations failed after ${max_attempts} attempts" >&2
    exit 1
  fi

  echo "[entrypoint] database is not ready yet (attempt ${attempt}/${max_attempts}), retrying in 2s..."
  attempt=$((attempt + 1))
  sleep 2
done

echo "[entrypoint] migrations applied, starting the application"

exec "$@"
