# Variables
DOCKER_IMAGE_NAME = astral-observer
DOCKER_CONTAINER_NAME = next-14
HOST_PORT = 8080
CONTAINER_PORT = 8080

.PHONY: build run dev clean stop clean-app deploy teardown install lint build-app build-local start-local

# Build the Docker image
build:
	docker build -t $(DOCKER_IMAGE_NAME) .

# Run the Docker container
run:
	docker run -d -p $(HOST_PORT):$(CONTAINER_PORT) --name $(DOCKER_CONTAINER_NAME) $(DOCKER_IMAGE_NAME)

# Stop and remove the Docker container
stop:
	docker stop $(DOCKER_CONTAINER_NAME)
	docker rm $(DOCKER_CONTAINER_NAME)

# Clean up Docker image
clean:
	docker rmi $(DOCKER_IMAGE_NAME)

# Development commands
install:
	npm ci

dev:
	npm run dev

# Run linting
lint:
	npm run lint

# Clean up node_modules and .next directory
clean-app:
	rm -rf node_modules .next

# Build the Next.js application
build-app:
	npm run build

# Build the Next.js application locally (alias for build-app)
build-local: build-app

# Start the Next.js application locally
start-local:
	npm start -- -p 8080

# All-in-one command for Docker deployment
deploy: build run

# All-in-one command to stop and clean up
teardown: stop clean