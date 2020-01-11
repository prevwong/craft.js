#!/bin/bash

npx lerna run clean --stream
wait

# build type definitons for utils
npx tsc --p packages/utils --skipLibCheck --emitDeclarationOnly
wait

# build type definitons for core
npx tsc --p packages/core --skipLibCheck --emitDeclarationOnly
wait

npx lerna run start --parallel --ignore docs