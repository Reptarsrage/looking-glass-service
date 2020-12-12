import { FastifyRequest } from 'fastify'

import PageResponse from '../dto/pageResponse'
import AuthResponse from '../dto/authResponse'
import FilterResponse from '../dto/filterResponse'
import PageRequest from '../dto/pageRequest'
import AuthorizeRequest from '../dto/authorizeRequest'
import { ModuleControllerBase } from '../base/base.controller'
import { Controller } from '../base/registeredControllers'
import definition from './reddit.definition'
import * as redditService from './reddit.service'

@Controller(definition)
export default class RedditController extends ModuleControllerBase {
  async getPage(req: FastifyRequest, accessToken: string, params: PageRequest): Promise<PageResponse> {
    const { after, query, sort } = params
    let { offset, filters } = params
    filters = filters || []
    offset = Math.max(0, offset || 0)

    if (query) {
      return redditService.getSearch(accessToken, offset, after, query, sort, filters)
    }

    return redditService.getListing(accessToken, offset, after, sort, filters)
  }

  async getAuthorize(request: AuthorizeRequest): Promise<AuthResponse> {
    return redditService.authorize(request.code)
  }

  async getRefresh(refreshToken: string): Promise<AuthResponse> {
    return redditService.refresh(refreshToken)
  }

  async getFilters(filter: string, itemId: string, accessToken: string): Promise<FilterResponse[]> {
    if (itemId) {
      return redditService.filtersForItem(accessToken, itemId)
    }

    return redditService.filters(accessToken, filter)
  }
}
