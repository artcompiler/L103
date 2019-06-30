default: build-dev start

build:
	npm run build

start: build
	npm start

watch: build
	npm run watch

build-dev:
	npm run build-dev

smoke: build
	npm run smoke

test: build
	npm run test

test-bugs: build
	npm run test-bugs
