#!/bin/bash

# https://github.com/vercel/next.js/blob/canary/publish-release.sh

git describe --exact-match

if [[ ! $? -eq 0 ]];then
  echo "Nothing to publish, exiting.."
  exit 0;
fi

if [[ -z "$NPM_TOKEN" ]];then
  echo "No NPM_TOKEN, exiting.."
  exit 0;
fi

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc

if [[ $(git describe --exact-match 2> /dev/null || :) =~ -alpha ]];
then
  echo "Publishing alpha"
  yarn run lerna publish from-git --npm-tag next --yes

  # Make sure to exit script with code 1 if publish failed
  if [[ ! $? -eq 0 ]];then
    exit 1;
  fi
else
  echo "Publishing packages"
  yarn run lerna publish from-git --yes # publish latest tagged commit

  if [[ ! $? -eq 0 ]];then
    exit 1;
  fi
fi
