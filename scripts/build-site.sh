#!/bin/sh
lerna run export --stream
rm -rf site/
mkdir site
touch site/.nojekyll
cp -r ./packages/examples/content-editor/out/* site/
cp -r ./packages/docs/build site/r
mkdir site/examples
cp -r ./packages/examples/nextjs/out/ site/examples/basic
wait
