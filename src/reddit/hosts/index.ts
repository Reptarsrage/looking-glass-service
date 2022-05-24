import type { AxiosInstance } from "axios";
import type { FastifyLoggerInstance } from "fastify";

import { PostData } from "../../reddit/dto/redditResponse";
import ItemResponse from "../../dto/itemResponse";
import { Host } from "../../reddit/dto/redditHost";

import GiphyHost from "./giphy";
import GfycatHost from "./gfycat";
import ImgurHost from "./imgur";
import RedditHost from "./reddit";
// import additional hosts here

const fallbackHost = new RedditHost();
const hosts: Host[] = [
  new GiphyHost(),
  new GfycatHost(),
  new ImgurHost(),
  // initialize additional hosts here

  // fallback host (reddit)
  fallbackHost,
];

function hostLookup(domain: string): Host | null {
  for (const host of hosts) {
    for (const regex of host.domains) {
      if (regex.test(domain)) {
        return host;
      }
    }
  }

  return null;
}

async function resolve(
  data: PostData,
  httpService: AxiosInstance,
  logger: FastifyLoggerInstance
): Promise<ItemResponse | null> {
  // lookup host using domain
  const { domain, url } = data;
  const host = hostLookup(domain);
  const childLogger = logger.child({ url });

  // parse post using domain specific logic
  try {
    if (host) {
      return await host.resolve(data, httpService, childLogger);
    }

    // dont warn for text posts
    if (!data.domain.startsWith("self.")) {
      childLogger.warn(`Unknown reddit content domain: ${data.domain}`);
    }
  } catch (error: unknown) {
    childLogger.error(error, `Error parsing reddit post using ${domain} logic`);
  }

  // parse using fallback logic
  try {
    if (host !== fallbackHost) {
      return await fallbackHost.resolve(data, httpService, childLogger);
    }
  } catch (error: unknown) {
    childLogger.error(error, `Error parsing reddit post using fallback logic`);
  }

  return null;
}

export default { resolve };
