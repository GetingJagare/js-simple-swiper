FROM node:22.12

USER node

WORKDIR /var/www/install

RUN chown node:node /var/www/install

COPY --chown=node:node package.json  .
COPY --chown=node:node package-lock.json .

RUN npm install --prefer-offline --no-audit --progress=false

WORKDIR /var/www/app
RUN chown node:node /var/www/app
COPY --chown=node:node dist .
COPY --chown=node:node public .
COPY --chown=node:node src .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node webpack.config.js .

EXPOSE 9000

CMD ["sh", "-c", "cp -rfu /var/www/install/node_modules/. /var/www/app/node_modules/ && chown -R node:node /var/www/app/node_modules && npm run dev"]