import "dotenv/config";
import path from "node:path";
import fastifyEnv from "@fastify/env";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

import schema from "./config";
import { build } from "./app";

const server = build({
  logger: {
    level: process.env.LOG_LEVEL ?? "debug",
    prettyPrint: true,
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
server.register(fastifyStatic, { root: path.join(__dirname, "..", "public") });

const port = parseInt(process.env.PORT ?? "3001", 10);
const host = process.env.HOST ?? "127.0.0.1";
server.listen(port, host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
