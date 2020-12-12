import { AxiosInstance } from 'axios'

import { Logger } from '../../logger'
import { PostData } from '../../reddit/dto/redditResponse'
import ItemResponse from '../../dto/itemResponse'
import { Host } from '../../reddit/dto/redditHost'

import GiphyHost from './giphy'
import GfycatHost from './gfycat'
import ImgurHost from './imgur'
import RedditHost from './reddit'
// import additional hosts here

const fallbackHost = new RedditHost()
const hosts: Host[] = [
  new GiphyHost(),
  new GfycatHost(),
  new ImgurHost(),
  // initialize additional hosts here
  // fallback host (reddit)
  fallbackHost,
]

function hostLookup(domain: string): Host {
  for (const host of hosts) {
    for (const regex of host.domains) {
      if (regex.test(domain)) {
        return host
      }
    }
  }

  return null
}

async function resolve(data: PostData, httpService: AxiosInstance, logger: Logger): Promise<ItemResponse> {
  // lookup host using domain
  const { domain, url } = data
  const host = hostLookup(domain)

  // parse post using domain specific logic
  try {
    if (host) {
      return await host.resolve(data, httpService, logger)
    }

    logger.warn(`Unknown reddit content domain: ${data.domain} (${data.url})`)
  } catch (error) {
    logger.error(`Error parsing reddit post ${url} using ${domain} logic`, error)
  }

  // parse using fallback logic
  try {
    if (host !== fallbackHost) {
      return await fallbackHost.resolve(data, httpService, logger)
    }
  } catch (error) {
    logger.error(`Error parsing reddit post ${url} using fallback logic`, error)
  }

  return null
}

export default { resolve }
