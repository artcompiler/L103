SUBPROJ := ./mathcore ./latexsympy

default: build-dev start

all: init build

init: .npm-install-done

.npm-install-done:
	npm install
	touch .npm-install-done

build-dev:
	npm run build

start:
	npm start

test:
	npm run test

debug:
	npm run debug

clean:
	rm -f .npm-install-done
	rm -rf node_modules
	rm -rf dist
	rm -rf build

.PHONY: $(SUBPROJ) init clean test
