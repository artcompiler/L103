SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)
PUB = $(LIB:lib/%.js=pub/%.js)

default: build run

build:
	npm run build-dev

run: build
	npm start

smoke: build
	npm run smoke

test: build
	npm run test
