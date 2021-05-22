#!/bin/bash

set -e 
rm -rf build
yarn clean 
yarn build:all

lerna run export --stream
mv site/build build
mkdir build/examples
cp -r ./examples/basic/out/ build/examples/basic
cp -r ./examples/landing/out/ build/examples/landing

touch build/.nojekyll
touch build/CNAME
echo "craft.js.org" >> build/CNAME