FROM node:14.18.3-alpine as base

WORKDIR /opt/node/app

RUN chown -R node:node /opt/node/app

COPY --chown=node:node package.json yarn.lock ./

COPY --chown=node:node prisma ./

USER node

RUN yarn --prod \
    && yarn cache clean --force \
    && yarn prisma:generate

ENV PATH /opt/node/app/node_modules/.bin:$PATH

FROM base as test

RUN yarn \
    && yarn cache clean --force

COPY --chown=node:node . .

CMD ["yarn", "test:all:cov"]

FROM test as build

RUN yarn build

FROM base as prod

COPY --chown=node:node --from=build /opt/node/app/dist/ ./dist

CMD ["yarn", "start:prod"]
