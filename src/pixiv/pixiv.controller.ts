import { FastifyRequest, FastifyReply } from 'fastify'

import PageResponse from 'src/dto/pageResponse'
import AuthResponse from 'src/dto/authResponse'
import FilterResponse from 'src/dto/filterResponse'
import PageRequest from 'src/dto/pageRequest'
import { ModuleControllerBase } from 'src/base/base.controller'
import { Controller } from 'src/base/registeredControllers'
import definition from './pixiv.definition'
import * as pixivService from './pixiv.service'
import LoginRequest from 'src/dto/loginRequest'

@Controller(definition)
export default class RedditController extends ModuleControllerBase {
  async getPage(req: FastifyRequest, accessToken: string, params: PageRequest): Promise<PageResponse> {
    const { query, sort, galleryId } = params
    let { offset, filters } = params
    filters = filters || []
    offset = Math.max(0, offset || 0)

    let filter
    if (filters) {
      filter = filters[0]
    }

    if (galleryId) {
      return pixivService.getGalleryPage(accessToken, req.hostname, galleryId, offset)
    }

    if (query || filters.length > 0) {
      return pixivService.searchIllust(accessToken, req.hostname, offset, query, filter)
    }

    return pixivService.getContentPage(accessToken, req.hostname, offset, sort)
  }

  async getLogin(request: LoginRequest): Promise<AuthResponse> {
    return pixivService.login(request.username, request.password)
  }

  async getRefresh(refreshToken: string): Promise<AuthResponse> {
    return pixivService.refresh(refreshToken)
  }

  async getFilters(filter: string, itemId: string, accessToken: string): Promise<FilterResponse[]> {
    return pixivService.filters(accessToken, filter)
  }

  getProxy(uri: string, res: FastifyReply, accessToken: string, req: FastifyRequest): void {
    const options = {
      headers: {
        Referer: 'http://www.pixiv.net/',
      },
    }

    this.proxyHelper(uri, options, req, res)
  }
}
