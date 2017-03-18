#!/bin/bash
pm2 describe compan > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start ./build/app.js --name=compan --silent -- --color
else
  pm2 reload compan --update-env --silent
fi;
