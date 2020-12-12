import config from './config'
import logger from './logger'
import createServer from './server'

// run fastify app
const HOST = config.get('HOST', '127.0.0.1')
const PORT = config.get('PORT', 3001)
const NODE_ENV = config.get('NODE_ENV', 'UNSPECIFIED')

const app = createServer({ logger })

app.listen(PORT, HOST, () => {
  logger.info(`Running in ${NODE_ENV} mode`)
  logger.info(`Server running at http://${HOST}:${PORT}`)
})
