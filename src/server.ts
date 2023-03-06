import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import fastifyEnv from "@fastify/env";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

import schema from "./config.js";
import { build } from "./app.js";

const server = build({
  logger: {
    level: process.env.LOG_LEVEL ?? "debug",
    transport: {
      target: "pino-pretty",
    },
  },
});

// Load and check configuration
server.register(fastifyEnv, {
  dotenv: true,
  schema,
});

// Enables the use of CORS in a Fastify application
server.register(fastifyCors);

// Plugin for serving static files as fast as possible
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.register(fastifyStatic, { root: path.resolve(__dirname, "..", "public") });

const port = parseInt(process.env.PORT ?? "3001", 10);
const host = process.env.HOST ?? "127.0.0.1";
server.listen({ host, port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
