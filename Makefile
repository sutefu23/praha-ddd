up:
	docker compose -f ./.docker/docker-compose.yml up -d

test:
	yarn --cwd ./backend/src test:unit