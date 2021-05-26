import got, { HTTPError, Response } from 'got'
import { FastifyRequest, FastifyReply } from 'fastify'
import logger from '../logger'

export default function stream(url: string, headers: any, req: FastifyRequest, res: FastifyReply): void {
  const { referer, host, 'sec-fetch-site': _, 'sec-fetch-mode': __, 'sec-fetch-dest': ___, ...reqHeaders } = req.headers
  const options = {
    headers,
  }

  got
    .stream(url, options)
    .on('response', (response: Response) => {
      // always set cache control headers for proxied content
      // we exclusively proxy image and video requests
      if (response.statusCode >= 200 && response.statusCode < 300) {
        response.headers['cache-control'] = 'public, max-age=31536000'
      }
    })
    .on('error', (e: HTTPError) => {
      const statusCode = (e.response && e.response.statusCode) || 500
      logger.warn(`Proxy Http Error: ${statusCode}: ${e.message}`)
      res.status(statusCode).send()
    })
    .pipe(res.raw)
}
