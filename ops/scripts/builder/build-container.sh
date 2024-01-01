#!/bin/bash
ENV=$1
DOCKER_HUB_USER=$2
DOCKER_HUB_PASSWORD=$3

cd /app

echo "$DOCKER_HUB_PASSWORD" | docker login --username $DOCKER_HUB_USER --password-stdin

docker build \
     -f /app/ops/docker/app/Dockerfile \
     --platform linux/amd64 \
     -t jonayrocks/31ngo-app:${ENV} .

docker push jonayrocks/31ngo-app:${ENV}
