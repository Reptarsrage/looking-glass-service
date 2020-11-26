import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import compression from 'fastify-compress'
import fastifyStatic from 'fastify-static'
import * as path from 'path'

import configureRoutes from './routes'

/**
 * creates the fastify server
 * adds all middleware
 * configures all routes
 */
function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  // create fastify app
  const app = fastify(opts)

  // add cors middleware
  app.register(cors)

  // add compression middleware
  app.register(compression)

  // add security middleware
  app.register(helmet)

  // add serving of static files
  app.register(fastifyStatic, { root: path.resolve(__dirname, '..', 'public') })

  // add the other routes
  configureRoutes(app)

  return app
}

export default createServer
