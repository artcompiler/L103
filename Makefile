SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)
PUB = $(LIB:lib/%.js=pub/%.js)

default: build run

build:
	npm run build-dev

run:
	npm start

smoke: build
	npm run test 100

test: build
	npm run test
