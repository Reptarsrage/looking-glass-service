import type PageResponse from "../dto/pageResponse";
import type AuthResponse from "../dto/authResponse";
import type FilterResponse from "../dto/filterResponse";
import ModuleControllerBase from "../base/base.controller";
import type { GetPageParams, GetAuthorizeParams, GetRefreshParams, GetFiltersParams } from "../base/base.controller";
import definition from "./reddit.definition";
import * as redditService from "./reddit.service";
import { truthy } from "../utils";

export default class RedditController extends ModuleControllerBase {
  public static definition = definition;

  override async getPage({ req, accessToken, params }: GetPageParams): Promise<PageResponse> {
    const { after = "", query = "", sort = "" } = params;
    let { offset, filters } = params;
    if (typeof filters === "string") {
      filters = [filters];
    }

    filters = (filters || []).filter(truthy);
    offset = Math.max(0, offset || 0);

    if (query) {
      return redditService.getSearch(accessToken, offset, after, query, sort, filters, req.log);
    }

    return redditService.getListing(accessToken, offset, after, sort, filters, req.log);
  }

  override async getAuthorize({ params }: GetAuthorizeParams): Promise<AuthResponse> {
    return redditService.authorize(params.code);
  }

  override async getRefresh({ refreshToken }: GetRefreshParams): Promise<AuthResponse> {
    return redditService.refresh(refreshToken);
  }

  override async getFilters({ accessToken, filter, itemId, req }: GetFiltersParams): Promise<FilterResponse[]> {
    if (itemId) {
      return redditService.filtersForItem(accessToken, itemId, req.log);
    }

    return redditService.filters(accessToken, filter, req.log);
  }
}
