import type PageResponse from "../dto/pageResponse";
import type AuthResponse from "../dto/authResponse";
import type FilterResponse from "../dto/filterResponse";
import ModuleControllerBase from "../base/base.controller";
import type { GetPageParams, GetAuthorizeParams, GetRefreshParams, GetFiltersParams } from "../base/base.controller";
import definition from "./reddit.definition";
import RedditService from "./reddit.service";
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

    const redditService = new RedditService(req);

    if (query) {
      return redditService.getSearch(accessToken, offset, after, query, sort, filters);
    }

    return redditService.getListing(accessToken, offset, after, sort, filters);
  }

  override async getAuthorize({ params, req }: GetAuthorizeParams): Promise<AuthResponse> {
    const redditService = new RedditService(req);
    return redditService.authorize(params.code);
  }

  override async getRefresh({ refreshToken, req }: GetRefreshParams): Promise<AuthResponse> {
    const redditService = new RedditService(req);
    return redditService.refresh(refreshToken);
  }

  override async getFilters({ accessToken, filter, itemId, req }: GetFiltersParams): Promise<FilterResponse[]> {
    const redditService = new RedditService(req);
    if (itemId) {
      return redditService.filtersForItem(accessToken, itemId);
    }

    return redditService.filters(accessToken, filter);
  }
}
