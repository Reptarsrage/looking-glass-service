
import type { FastifyRequest } from "fastify";
import type { AxiosInstance } from "axios";

import type { HostBasedDerived } from "../dto/redditHost.js";

import GiphyHost from "./giphy.js";
import GfycatHost from "./gfycat.js";
import ImgurHost from "./imgur.js";
import RedditHost from "./reddit.js";

// import additional hosts here

class HostFactory {
  private req: FastifyRequest;
  private httpService: AxiosInstance;
  private hostTypes: Array<HostBasedDerived> = [GiphyHost, GfycatHost, ImgurHost, RedditHost];

  constructor(req: FastifyRequest, httpService: AxiosInstance) {
    this.req = req;
    this.httpService = httpService;
  }

  public getHost = (domain: string, url: string) => {
    for (const Host of this.hostTypes) {
      for (const regex of Host.domains) {
        if (regex.test(domain)) {
          return new Host(this.req, this.httpService, url);
        }
      }
    }

    // return fallback host
    return new RedditHost(this.req, this.httpService, url);
  };
}

export default HostFactory;
