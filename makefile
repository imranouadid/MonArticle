MAKEFLAGS += --no-print-directory

COMPOSE = docker-compose
PHP_CONTAINER := php-container
NGINX_CONTAINER := nginx-container
MONGO_CONTAINER := mongo-container

default: help

start: ## Start the app
	@make build up install gen-jwt-keypair create-demo-account cache-clear

build: ## Build images stack
	@$(COMPOSE) build

up: ## Start stack
	@$(COMPOSE) up -d

stop: ## Stop stack
	@$(COMPOSE) stop

restart: ## Restart stack
	@make stop
	@make up

down: ## Drop the containers stack
	@$(COMPOSE) down --remove-orphans

backend-exec-cmd: ## Execute commands in PHP container
	@docker exec $(PHP_CONTAINER) bash -c "${OPT}"

sh-backend:  ## Connect to backend container
	@docker exec -it $(PHP_CONTAINER) bash

sh-db:  ## Connect to mongoDB container
	@docker exec -it $(MONGO_CONTAINER) bash -c "mongosh"

gen-jwt-keypair: ## Generate Lexik JWT keypair
	@make backend-exec-cmd OPT="php bin/console lexik:jwt:generate-keypair --overwrite"

db-create-collections: ## Create mongoDB collections
	@make backend-exec-cmd OPT="php bin/console doctrine:mongodb:schema:create"

create-demo-account: ## Create Demo account
	@make backend-exec-cmd OPT="php bin/console app:create-demo-account demo1@gmail.com 'Imran Ouadid'"
	@make backend-exec-cmd OPT="php bin/console app:create-demo-account demo2@gmail.com 'Amrani Kamal'"

cache-clear: ## Clear cache
	@make backend-exec-cmd OPT="php bin/console cache:clear && php bin/console cache:warmup"

install:  ## Install dependencies
	@make backend-exec-cmd OPT="composer install --no-interaction"

nginx-exec-cmd:	## Execute commands in Nginx container
	@docker exec $(NGINX_CONTAINER) sh -c "${OPT}"

sh-nginx:  ## Connect to Nginx container
	@docker exec -it $(NGINX_CONTAINER) sh

logs: ## Show containers logs
	@$(COMPOSE) logs

debug-router: ## List routes
	@make backend-exec-cmd OPT="php bin/console debug:router"

help: ## This help dialog.
	@awk -F ':|##' '/^[^\t].+?:.*?##/ {printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF}' $(MAKEFILE_LIST)
