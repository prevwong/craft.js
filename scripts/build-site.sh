#!/bin/sh
lerna run export --stream
rm -rf site/
mkdir site
cp -r ./packages/examples/landing/out/* site/
touch site/.nojekyll
cp -r ./packages/docs/build site/r
mkdir site/examples
cp -r ./packages/examples/basic/out/ site/examples/basic
wait
