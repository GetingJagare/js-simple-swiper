FROM node:24.1.0

USER node

WORKDIR /var/www/install

RUN chown node:node /var/www/install

COPY --chown=node:node package.json  .
COPY --chown=node:node package-lock.json .
COPY --chown=node:node entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN npm install --prefer-offline --no-audit --progress=false

WORKDIR /var/www/app
RUN chown node:node /var/www/app

EXPOSE 9000

CMD ["sh", "-c", "/var/www/install/entrypoint.sh"]