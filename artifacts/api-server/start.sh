#!/bin/sh
export PORT=8080
exec node --enable-source-maps ./dist/index.mjs
