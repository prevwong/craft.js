#!/bin/bash

args=()

while getopts ":w" options; do 
    case "${options}" in
        w)
            args+=( '-w' );
        ;;
        *)          
            echo "Invalid option";
            exit 1
        ;;
    esac
done

rollup=../../rollup.config.js
if [ -f ./rollup.config.js ]
then
  rollup=rollup.config.js
fi

pnpm tsc --skipLibCheck --emitDeclarationOnly "${args[@]}" &
pnpm rollup -c "${rollup}" "${args[@]}"
