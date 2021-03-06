import { FastifyInstance } from 'fastify'
import glob from 'glob'
import path from 'path'

import registeredControllers from './base/registeredControllers'
import rootController from './root/root.controller'
import logger from './logger'
import PageRequest from './dto/pageRequest'

// glob require all controllers
glob.sync(path.resolve(__dirname, '**', '!(base|app).controller.{js,ts}')).map((file) => require(file))

/**
 * configures all routes
 * @param app
 */
function configure(app: FastifyInstance): void {
  // add main route
  app.get('/', async (req, res) => {
    try {
      const response = await rootController.getModules(req)
      return response
    } catch (error) {
      logger.error(error, `Error executing '/'`)
      res.status(500).send({ error: 'An unexpected error occurred' })
    }
  })

  // add routes for all registered controllers
  registeredControllers.getAll().forEach((moduleId) => {
    const { controller } = registeredControllers.get(moduleId)

    app.get(`/${moduleId}`, async (req, res) => {
      try {
        const accessToken = req.headers['access-token'] as string
        let filters = req.query['filters'] as string | string[]
        if (typeof filters === 'string' || filters instanceof String) {
          filters = [filters as string]
        }

        const request: PageRequest = {
          galleryId: req.query['galleryId'] as string,
          query: req.query['query'] as string,
          offset: parseInt((req.query['offset'] as string) || '0', 10),
          after: req.query['after'] as string,
          sort: req.query['sort'] as string,
          filters,
        }

        const response = await controller.getPage(req, accessToken, request)
        return response
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })

    app.get(`/${moduleId}/login`, async (req, res) => {
      try {
        const username = req.query['username'] as string
        const password = req.query['password'] as string
        const response = await controller.getLogin({ username, password })
        res.header('cache-control', 'no-cache') // no caching for auth
        return response
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}/login'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })

    app.get(`/${moduleId}/authorize`, async (req, res) => {
      try {
        const code = req.query['code'] as string
        const response = await controller.getAuthorize({ code })
        res.header('cache-control', 'no-cache') // no caching for auth
        return response
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}/authorize'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })

    app.get(`/${moduleId}/refresh`, async (req, res) => {
      try {
        const refreshToken = req.headers['refresh-token'] as string
        const response = await controller.getRefresh(refreshToken)
        res.header('cache-control', 'no-cache') // no caching for auth
        return response
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}/refresh'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })

    app.get(`/${moduleId}/filters`, async (req, res) => {
      try {
        const accessToken = req.headers['access-token'] as string
        const filter = req.query['filter'] as string
        const itemId = req.query['itemId'] as string
        const response = await controller.getFilters(filter, itemId, accessToken)
        res.header('cache-control','public, max-age=31536000') // cache filters for a long time!
        return response
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}/filters'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })

    app.get(`/${moduleId}/proxy`, (req, res) => {
      try {
        let accessToken = req.headers['access-token'] as string
        accessToken = accessToken || req.query['accessToken']
        const uri = req.query['uri'] as string
        controller.getProxy(uri, res, accessToken, req)
      } catch (error) {
        logger.error(error, `Error executing '/${moduleId}/proxy'`)
        res.status(500).send({ error: 'An unexpected error occurred' })
      }
    })
  })
}

export default configure
