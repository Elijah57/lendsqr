FROM node:20.16.0-alpine3.20
RUN addgroup dev && adduser -S -G dev kachi
USER kachi

WORKDIR /usr/src/app

COPY --chown=kachi:dev package*.json .
RUN npm install

COPY --chown=kachi:dev . .