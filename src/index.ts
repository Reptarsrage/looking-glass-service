import config from './config'
import logger from './logger'
import createServer from './server'

// run fastify app
const PORT = config.get('PORT', 3001)
const NODE_ENV = config.get('NODE_ENV', 'UNSPECIFIED')

const app = createServer({ logger })

app.listen(PORT, () => {
  logger.info(`Running in ${NODE_ENV} mode`)
  logger.info(`Server running at http://localhost:${PORT}`)
})
