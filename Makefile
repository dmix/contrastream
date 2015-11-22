### copperhead.co

default: build

BIN=./node_modules/.bin

run:
	@npm run dev

build:
	@./node_modules/babel/bin/babel-node.js contra.js

install:
	@touch package.json
	@npm install

optimize:
	htmlmin dist/**/*.html
	uglifyjs dist/bundle.js
	cssnano dist/bundle.css
	imagemin dist/images

.PHONY: build optimize install
