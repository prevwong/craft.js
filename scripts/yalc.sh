#!/bin/bash

defaultRollupConfig=../../rollup.config.js
if [ -f ./rollup.config.js ]; then
  defaultRollupConfig=rollup.config.js
fi

command="
  npx tsc --skipLibCheck --emitDeclarationOnly &
  npx rollup -c ${defaultRollupConfig};
  yalc push
"

echo $command

nodemon --watch src -x "${command}"
