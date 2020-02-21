SUBPROJ := ./mathcore ./latexsympy

default: build-dev start

build:
	npm run build

start: build
	npm start

watch: build
	npm run watch

build-dev:
	npm run build-dev

smoke:
	npm run smoke

test:
	npm run test

test-bugs: build
	npm run test-bugs

.PHONY: $(SUBPROJ) init clean test
