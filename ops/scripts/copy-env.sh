#!/bin/sh
ENV="$1"

if [ "$2" = "ws" ]; then
    TARGET_DIR="./ws"
    ENV_FILE="ops/docker/ws/.env.$ENV"
else
    TARGET_DIR="."
    ENV_FILE="ops/docker/app/.env.$ENV"
fi

if [ -f "$TARGET_DIR/.env" ]; then
    rm "$TARGET_DIR/.env"
fi

cp -n "$ENV_FILE" "$TARGET_DIR/.env"

