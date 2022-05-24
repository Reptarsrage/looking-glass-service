import path from "node:path";
import fastify, { FastifyServerOptions } from "fastify";
import fastifyCaching from "@fastify/caching";
import fastifyEnv from "@fastify/env";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

import schema from "./config";
import configureRoutes from "./routes";

export function build(opts?: FastifyServerOptions) {
  const app = fastify(opts);

  // Load and check configuration
  app.register(fastifyEnv, {
    dotenv: true,
    schema,
  });

  // Enables the use of CORS in a Fastify application
  app.register(fastifyCors);

  // Plugin for serving static files as fast as possible
  app.register(fastifyStatic, { root: path.join(__dirname, "..", "public") });

  // General server-side cache and ETag support
  app.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 3600,
  });

  configureRoutes(app);

  return app;
}
