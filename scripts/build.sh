#!/bin/bash

args=()
if [ $NODE_ENV == 'development' ]
then
   args+=( '-w' );
fi


defaultRollupConfig=../../rollup.config.js
if [ -f ./rollup.config.js ]
then
  defaultRollupConfig=rollup.config.js
fi

npx tsc --skipLibCheck --emitDeclarationOnly "${args[@]}" &
npx rollup -c "${defaultRollupConfig}" "${args[@]}"