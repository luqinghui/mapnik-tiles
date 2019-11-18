FROM node:carbon-jessie

WORKDIR /app

RUN apt-get update \
    && apt-get install yarn \
    && apt-get update \
    && yarn install

ENV PORT=8001

CMD node app.js

EXPOSE 8001

LABEL maintainer "luqinghui0613@gmail.com"
