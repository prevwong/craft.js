#!/bin/sh
npx ../../scripts/create-dist-index.js
npx tsc --skipLibCheck
npx babel --config-file=../../babel.config.js lib --ignore="src/**/__tests__/**" --out-dir dist/esm
wait

if [ -f ./rollup.config.js ]
then
  npx rollup -c rollup.config.js
fi