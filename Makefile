.PHONY: ensure_branches run clean demo demo2

# `ensure_branches` ensures that the `v2`, `v3` and `v4` branches exist.
# (the `v1` branch is `main` which always exists after a clone).
ensure_branches:
	@git checkout v2
	@git checkout v3
	@git checkout v4
	@git checkout main

# `demo` builds the `v1` and `v2` docker images required for running the demo and
# then runs the demo.
demo: ensure_branches
	@git checkout main
	@docker compose --profile v1 build
	@git checkout v2
	@docker compose --profile v2 build
	@git checkout main
	@docker compose --profile demo up --wait
	@hack/migrate.sh
	@docker compose --profile demo logs -f

# `demo2` builds the second demo app - making an existing column NOT NULL.
# It uses the `v3` and `v4` branches.
demo2: ensure_branches
	@git checkout v3
	@docker compose --profile v3 build
	@git checkout v4
	@docker compose --profile v4 build
	@git checkout v3
	@docker compose --profile demo2 up --wait
	@hack/migrate.sh
	@docker compose --profile demo2 logs -f

# `run` runs one instance of the application.
run: 
	@docker compose --profile dev up --build --wait 
	@hack/migrate.sh
	@docker compose --profile dev logs -f

# `clean` removes all docker containers, networks and volumes.
clean:
	@docker compose --profile demo --profile dev --profile demo2 down -v
