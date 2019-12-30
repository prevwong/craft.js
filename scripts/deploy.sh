#!/bin/bash

set -e 
yarn clean 
wait

yarn build
wait
lerna run export --stream
rm -rf site/
mkdir site
cp -r ./packages/examples/landing/out/* site/
touch site/.nojekyll
cp -r ./packages/docs/build site/r
mkdir site/examples
cp -r ./packages/examples/basic/out/ site/examples/basic
