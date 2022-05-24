import type { AxiosInstance } from "axios";
import type { FastifyLoggerInstance } from "fastify";

import type { PostData } from "./redditResponse";
import type ItemResponse from "../../dto/itemResponse";

export type ResolveFunc = (
  post: PostData,
  httpService: AxiosInstance,
  logger: FastifyLoggerInstance
) => Promise<ItemResponse | null>;

export interface Host {
  domains: RegExp[];
  resolve: ResolveFunc;
}
