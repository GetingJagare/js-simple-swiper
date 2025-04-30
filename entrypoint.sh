#!/bin/sh

cd /var/www/app
cp -rfu ../install/node_modules/. ./node_modules/
chown -R node:node ./node_modules

if [ "$NODE_ENV" = "development" ]; then
    npm run dev
elif [ "$NODE_ENV" = "production" ]; then
    npm run build
fi