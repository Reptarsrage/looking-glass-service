import fastify, { FastifyServerOptions } from "fastify";

import configureRoutes from "./routes.js";

export function build(opts?: FastifyServerOptions) {
  const app = fastify(opts);

  configureRoutes(app);

  return app;
}
