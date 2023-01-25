FROM node:19-alpine AS node-with-deps

WORKDIR /usr/app

COPY package*.json .

RUN npm install --quiet

FROM node-with-deps

COPY . .

ENV NODE_ENV production
ENV NEXT_PUBLIC_ENV production
ENV NPM_CONFIG_CACHE /tmp

RUN npm run build

CMD npm run start