/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify'

import PageResponse from '../dto/pageResponse'
import AuthResponse from '../dto/authResponse'
import FilterResponse from '../dto/filterResponse'
import LoginRequest from '../dto/loginRequest'
import PageRequest from '../dto/pageRequest'
import AuthorizeRequest from '../dto/authorizeRequest'
import stream from './stream'

export class NotImplementedException extends Error {
  name = 'NotImplementedError'
  message = 'Method Not Implemented'
}

export abstract class ModuleControllerBase {
  getPage(req: FastifyRequest, accessToken: string, params: PageRequest): Promise<PageResponse> {
    throw new NotImplementedException()
  }

  getLogin(request: LoginRequest): Promise<AuthResponse> {
    throw new NotImplementedException()
  }

  getAuthorize(request: AuthorizeRequest): Promise<AuthResponse> {
    throw new NotImplementedException()
  }

  getRefresh(refreshToken: string): Promise<AuthResponse> {
    throw new NotImplementedException()
  }

  getProxy(uri: string, res: FastifyReply, accessToken: string, req: FastifyRequest): void {
    this.proxyHelper(uri, { headers: {} }, req, res)
  }

  getFilters(filter: string, itemId: string, accessToken: string): Promise<FilterResponse[]> {
    throw new NotImplementedException()
  }

  /**
   * helps out proxy by stripping out unwanted headers
   *
   * @param options - Options to be passed to got stream
   * @param req  - Request
   */
  protected proxyHelper(url: string, options: any, req: FastifyRequest, res: FastifyReply): void {
    stream(url, (options || {}).headers, req, res)
  }
}
