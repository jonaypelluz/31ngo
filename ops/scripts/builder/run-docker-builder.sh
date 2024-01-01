#!/bin/sh

# Reading arguments
ENV=$1
DOCKER_HUB_USER=$2
DOCKER_HUB_PASSWORD=$3

# Variables
CONTAINER_NAME=builder
USER_DIR=$(pwd)

if [ -z "$ENV" ]; then
    echo "--------------------------"
    echo "You have to choose an ENV variable"
    echo "--------------------------"
else
    sh "$USER_DIR/ops/scripts/copy-env.sh" prod

    echo "--------------------------"

    docker run -d \
        --name $CONTAINER_NAME \
        --platform linux/amd64 \
        -v "$USER_DIR:/app" \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -ti alpine:latest
    
    docker exec -i $CONTAINER_NAME /bin/sh -c "apk update"
    docker exec -i $CONTAINER_NAME /bin/sh -c "apk add docker docker-cli-compose git bash"
    docker exec -i $CONTAINER_NAME /bin/bash -c "/app/ops/scripts/builder/build-container.sh $ENV $DOCKER_HUB_USER $DOCKER_HUB_PASSWORD"

    docker rm -f $CONTAINER_NAME

    sh "$USER_DIR/ops/scripts/copy-env.sh" development
fi
