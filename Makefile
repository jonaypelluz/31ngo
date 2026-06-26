PROJECT_NAME = 31ngo

CONTAINER_NAME ?= app

CONTAINER = $$(docker ps | grep $(CONTAINER_NAME) | awk '{print $$1}')
DOCKER_COMPOSE := -p $(PROJECT_NAME) -f ops/docker/docker-compose.yml

## Build and start the app container
build:
	docker-compose $(DOCKER_COMPOSE) up -d --build

## Start the app container
start:
	docker-compose $(DOCKER_COMPOSE) up -d

restart: stop start

## Stop the app container
stop:
	docker-compose $(DOCKER_COMPOSE) stop

## Attach shell to the running app container
enter: is-running
	@docker exec -it $(CONTAINER) /bin/bash

## Run eslint
lint: is-running
	@docker exec -it $(CONTAINER) yarn lint

## Fix eslint errors
lint-fix: is-running
	@docker exec -it $(CONTAINER) yarn lint:fix

is-running:
	@docker exec $(CONTAINER) true 2>/dev/null || (echo "Container not running — run: make start or make build"; exit 1)

# COLORS
TPUT := $(shell command -v tput 2> /dev/null)

ifdef TPUT
	GREEN  := $(shell tput -Txterm setaf 2)
	YELLOW := $(shell tput -Txterm setaf 3)
	RESET  := $(shell tput -Txterm sgr0)
endif

TARGET_MAX_CHAR_NUM=20
## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  $(YELLOW)make$(RESET) $(GREEN)<target>$(RESET)'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  $(YELLOW)%-$(TARGET_MAX_CHAR_NUM)s$(RESET) $(GREEN)%s$(RESET)\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
