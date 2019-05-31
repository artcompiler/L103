SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)
PUB = $(LIB:lib/%.js=pub/%.js)

default: build run

build-dev:
	npm run build-dev

build:
	npm run build

run: build-dev
	npm start

smoke: build
	npm run smoke

test: build
	npm run test

test-bugs: build
	npm run test-bugs
