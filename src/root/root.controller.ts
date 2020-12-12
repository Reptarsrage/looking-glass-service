import { FastifyRequest } from 'fastify'

import rootService from './root.service'
import Module from '../dto/moduleResponse'

function getModules(req: FastifyRequest): Module[] {
  const baseUrl = `${req.protocol}://${req.hostname}`
  return rootService.getModules(baseUrl)
}

export default { getModules }
