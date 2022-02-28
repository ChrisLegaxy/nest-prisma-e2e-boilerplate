lint:
	make megalinter

megalinter:
	docker run --rm -v $(shell pwd):/app --user $(shell id -u):$(shell id -g) -e DEFAULT_WORKSPACE=/app megalinter/megalinter:v5.4.0
