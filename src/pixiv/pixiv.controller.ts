import { FastifyRequest, FastifyReply } from 'fastify'

import PageResponse from '../dto/pageResponse'
import AuthResponse from '../dto/authResponse'
import FilterResponse from '../dto/filterResponse'
import PageRequest from '../dto/pageRequest'
import { ModuleControllerBase } from '../base/base.controller'
import { Controller } from '../base/registeredControllers'
import definition from './pixiv.definition'
import * as pixivService from './pixiv.service'
import AuthorizeRequest from '../dto/AuthorizeRequest'

@Controller(definition)
export default class RedditController extends ModuleControllerBase {
  async getPage(req: FastifyRequest, accessToken: string, params: PageRequest): Promise<PageResponse> {
    const { query, sort, galleryId } = params
    let { offset, filters } = params
    filters = filters || []
    offset = Math.max(0, offset || 0)

    if (galleryId) {
      return pixivService.getGalleryPage(accessToken, req.hostname, galleryId, offset)
    }

    if (query || filters.length > 0) {
      return pixivService.searchIllust(accessToken, req.hostname, offset, filters, query)
    }

    return pixivService.getContentPage(accessToken, req.hostname, offset, sort)
  }

  async getAuthorize(request: AuthorizeRequest): Promise<AuthResponse> {
    return pixivService.authorize(request.code)
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
