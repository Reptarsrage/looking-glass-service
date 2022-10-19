import type { AxiosInstance } from "axios";
import type { FastifyRequest } from "fastify";

import { HostBasedDerived } from "../dto/redditHost";
import GiphyHost from "./giphy";
import GfycatHost from "./gfycat";
import ImgurHost from "./imgur";
import RedditHost from "./reddit";

// import additional hosts here
import RedgifsHost from "./redgifs";

class HostFactory {
  private req: FastifyRequest;
  private httpService: AxiosInstance;
  private hostTypes: Array<HostBasedDerived> = [GiphyHost, GfycatHost, ImgurHost, RedditHost, RedgifsHost];

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
