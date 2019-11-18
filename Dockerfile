FROM node:carbon-jessie

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install

ENV PORT=8001

CMD yarn run start

EXPOSE 8001

LABEL maintainer "luqinghui0613@gmail.com"
