# set up
FROM node:alpine as env
ENV HOST 0.0.0.0
EXPOSE 3001

# restore
FROM env as restore
WORKDIR /src
COPY package*.json ./
RUN npm install

# build
FROM restore as build
WORKDIR /src
COPY . .
RUN npm run build
RUN [ -f prod.env ] && mv prod.env /src/dist/.env

# run
FROM build as final
WORKDIR /src/dist
CMD [ "node", "server.js" ]
