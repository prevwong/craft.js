#!/bin/sh

npx ../../scripts/create-dist-index.js development
npx tsc --skipLibCheck -w
wait