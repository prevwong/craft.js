#!/bin/bash

set -e 
rm -rf site/
yarn clean 
yarn build:all

lerna run export --stream
mkdir site
cp -r ./packages/examples/landing/out/* site/
cp -r ./packages/examples/landing/seo/* site/
cp -r ./packages/docs/build site/r
mkdir site/examples
cp -r ./packages/examples/basic/out/ site/examples/basic

touch site/.nojekyll
touch site/CNAME
echo "craft.js.org" >> site/CNAME