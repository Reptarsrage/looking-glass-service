# set up
FROM node:19.7-bullseye-slim AS base
WORKDIR /usr/src/app

# restore
FROM base as restore
COPY package*.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

# build
FROM restore as build
COPY . .
RUN npm run build
RUN [ -f prod.env ] && mv prod.env /usr/src/app/dist/.env

# run
FROM build as final
ENV NODE_ENV production
EXPOSE 3001
CMD [ "node", "dist/server.js" ]
