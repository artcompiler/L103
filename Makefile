SUBPROJ := ./mathcore ./latexsympy

default: build start

build:
	npm run build-dev

start: build
	npm start

watch: build
	npm run watch

smoke:
	npm run smoke

test:
	npm run test $(color)

test-bugs:
	npm run test-bugs

.PHONY: $(SUBPROJ) init clean test build
