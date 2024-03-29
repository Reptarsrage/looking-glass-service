/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AxiosRequestHeaders } from "axios";

import type PageResponse from "../dto/pageResponse.js";
import type AuthResponse from "../dto/authResponse.js";
import type FilterResponse from "../dto/filterResponse.js";
import type LoginRequest from "../dto/loginRequest.js";
import type PageRequest from "../dto/pageRequest.js";
import type AuthorizeRequest from "../dto/authorizeRequest.js";
import type ModuleResponse from "../dto/moduleResponse.js";
import type { Config } from "../config.js";

import stream from "./stream.js";

class NotImplementedException extends Error {
  name = "NotImplementedError";
  message = "Method Not Implemented";
}

interface CommonParams {
  req: FastifyRequest;
  res: FastifyReply;
  config: Config;
}

export interface GetPageParams extends CommonParams {
  accessToken: string;
  params: PageRequest;
}

export interface GetLoginParams extends CommonParams {
  params: LoginRequest;
}

export interface GetAuthorizeParams extends CommonParams {
  params: AuthorizeRequest;
}

export interface GetRefreshParams extends CommonParams {
  refreshToken: string;
}

export interface GetProxyParams extends CommonParams {
  uri: string;
  accessToken?: string;
}

export interface GetFiltersParams extends CommonParams {
  filter: string;
  itemId: string;
  accessToken: string;
}

export default abstract class ModuleControllerBase {
  public static definition: ModuleResponse;

  getPage(params: GetPageParams): Promise<PageResponse> {
    throw new NotImplementedException();
  }

  getLogin(params: GetLoginParams): Promise<AuthResponse> {
    throw new NotImplementedException();
  }

  getAuthorize(params: GetAuthorizeParams): Promise<AuthResponse> {
    throw new NotImplementedException();
  }

  getRefresh(params: GetRefreshParams): Promise<AuthResponse> {
    throw new NotImplementedException();
  }

  getProxy(params: GetProxyParams): void {
    this.proxyHelper(params.uri, {}, params.res);
  }

  getFilters(params: GetFiltersParams): Promise<FilterResponse[]> {
    throw new NotImplementedException();
  }

  /**
   * helps out proxy by stripping out unwanted headers
   *
   * @param url - URL to fetch and stream back to user
   * @param headers - Headers to be forwarded to URL
   * @param res - Fastify reply
   */
  protected proxyHelper(url: string, headers: Record<string, string | undefined>, res: FastifyReply): void {
    stream(url, headers, res);
  }
}
