import type { AxiosInstance } from "axios";
import type { FastifyBaseLogger, FastifyRequest } from "fastify";

import type ItemResponse from "../../dto/itemResponse.js";

import type { PostData } from "./redditResponse.js";

export type ResolveFunc = (post: PostData) => Promise<ItemResponse | null>;

export abstract class HostBase {
  protected req: FastifyRequest;
  protected httpService: AxiosInstance;
  protected logger: FastifyBaseLogger;

  constructor(req: FastifyRequest, httpService: AxiosInstance, url: string) {
    this.req = req;
    this.logger = req.log.child({ url });
    this.httpService = httpService;
  }

  public static domains: RegExp[];
  abstract parsePost: ResolveFunc;
}

export type HostBasedDerived = {
  new (req: FastifyRequest, httpService: AxiosInstance, url: string): HostBase;
} & typeof HostBase;
