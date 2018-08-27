BIN_DIR=`npm bin`
PRETTIER_PATTERN="src/**/*.ts"

build:
	${BIN_DIR}/tsc

watch:
	${BIN_DIR}/tsc -w

test:
	${BIN_DIR}/mocha -r ts-node/register "src/**/*.spec.ts"

check:
	${BIN_DIR}/tslint "src/**/*.ts"
	${BIN_DIR}/prettier --list-different ${PRETTIER_PATTERN}

pretty:
	${BIN_DIR}/prettier --write ${PRETTIER_PATTERN}

example:
	${BIN_DIR}/mocha -r ts-node/register "examples/**/*.spec.ts"
