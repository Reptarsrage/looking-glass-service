# Looking Glass Service

![Github](https://github.com/Reptarsrage/looking-glass-service/workflows/CI/badge.svg)
![Codecov](https://codecov.io/gh/Reptarsrage/looking-glass-service/branch/master/graph/badge.svg?token=Zs6t1fbmJ6)

## Description

A service for use with the [looking glass client application](https://github.com/Reptarsrage/looking-glass). This service serves up content from across the web.

⚠ Built for development practice only. ⚠

## Install

Install the dependencies with `yarn`.

```bash
cd your-project-name
yarn install
```

## Setting up the environment

For local development, create a `.env` file in the project root directory with the following environment variables:

```
PORT=
REDDIT_CLIENT_ID=
REDDIT_USER_AGENT=
IMGUR_CLIENT_ID=
GIPHY_API_KEY=
PIXIV_CLIENT_ID=
PIXIV_CLIENT_SECRET=
PIXIV_HASH_SECRET=
```

> NOTE: To self - These are saved in LastPass.

## Running the app

Run the app using `nodemon` or `node` via `yarn` scripts:

```bash
# development
yarn dev

# production mode
yarn start
```

## Test

Run unit tests using the `jest-cli` via `yarn` scripts:

```bash
# unit tests
yarn test

# watch
yarn test --watch

# test coverage
yarn test --coverage
```

> NOTE: More on the `jest-cli` here: https://jestjs.io/docs/en/cli

## Docker

Build a docker image using the `docker-cli`:

```bash
docker build -t looking-glass-service:latest .
```

Run the container for the docker image with a exposed port 3001:

```bash
docker run --rm -it -p 3001:3001 looking-glass-service:latest
```

Build and deploy image as a docker container:

```bash
docker build -t looking-glass-service:latest .
docker stop lgs
docker rm lgs
docker create -i -t -p 3001:3001 --name lgs looking-glass-service
docker start lgs
docker update --restart unless-stopped lgs
```

> NOTE: More on the `docker-cli` here: https://docs.docker.com/engine/reference/commandline/cli/
