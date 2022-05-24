# Looking Glass Service

![Github](https://github.com/Reptarsrage/looking-glass-service/workflows/CI/badge.svg)
![Codecov](https://codecov.io/gh/Reptarsrage/looking-glass-service/branch/main/graph/badge.svg?token=Zs6t1fbmJ6)

## Description

A service for use with the [looking glass client application](https://github.com/Reptarsrage/looking-glass). This service serves up content from across the web.

⚠ Built for development practice only. ⚠

## Install

Install the dependencies with `npm`.

```bash
cd looking-glass-service
npm install
```

## Setting up the environment

For local development, create a `.env` file in the project root directory with the following environment variables:

```
NODE_ENV=development
LOG_LEVEL=warn
HOST=127.0.0.1
PORT=3001
REDDIT_CLIENT_ID=
REDDIT_USER_AGENT=
IMGUR_CLIENT_ID=
GIPHY_API_KEY=
PIXIV_CLIENT_ID=
PIXIV_CLIENT_SECRET=
```

> NOTE: To self - These are saved in LastPass.

## Running the app

Run the app using `npm` scripts:

```bash
# development
npm run dev

# production mode
npm run build
npm run start
```

## Test

Run unit tests using `npm` scripts:

```bash
# unit tests
npm test

# watch
npm test -- --watch
```

> NOTE: More on the `tap` CLI here: https://node-tap.org/docs/cli/

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

# to run directly
docker run -i -t -p 3001:3001 --env-file .env.prod looking-glass-service:latest

# to run as a container
docker stop lgs
docker rm lgs
docker create -i -t -p 3001:3001 --name lgs --env-file prod.env looking-glass-service
docker start lgs
docker update --restart unless-stopped lgs
```

> NOTE: More on the `docker-cli` here: https://docs.docker.com/engine/reference/commandline/cli/
