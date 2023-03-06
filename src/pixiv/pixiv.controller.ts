import type PageResponse from "../dto/pageResponse.js";
import type FilterResponse from "../dto/filterResponse.js";
import ModuleControllerBase, {
  GetAuthorizeParams,
  GetFiltersParams,
  GetProxyParams,
  GetRefreshParams,
} from "../base/base.controller.js";
import type AuthResponse from "../dto/authResponse.js";
import type { GetPageParams } from "../base/base.controller.js";
import definition from "./pixiv.definition.js";
import * as pixivService from "./pixiv.service.js";
import { truthy } from "../utils.js";

export default class RedditController extends ModuleControllerBase {
  public static definition = definition;

  override async getPage({ params, accessToken, req }: GetPageParams): Promise<PageResponse> {
    const { query = "", sort = "", galleryId = "" } = params;
    let { offset, filters } = params;
    if (typeof filters === "string") {
      filters = [filters];
    }

    filters = (filters || []).filter(truthy);
    offset = Math.max(1, offset || 1);

    if (galleryId) {
      return pixivService.getGalleryPage(accessToken, req.hostname, galleryId, offset);
    }

    if (query || filters.length > 0) {
      return pixivService.searchIllust(accessToken, req.hostname, offset, filters, query);
    }

    return pixivService.getContentPage(accessToken, req.hostname, offset, sort);
  }

  override async getAuthorize({ params }: GetAuthorizeParams): Promise<AuthResponse> {
    return pixivService.authorize(params.code);
  }

  override async getRefresh({ refreshToken }: GetRefreshParams): Promise<AuthResponse> {
    return pixivService.refresh(refreshToken);
  }

  override async getFilters({ filter, accessToken }: GetFiltersParams): Promise<FilterResponse[]> {
    return pixivService.filters(accessToken, filter);
  }

  override getProxy({ uri, req, res }: GetProxyParams): void {
    const headers: Record<string, string | undefined> = {
      ...(req.headers as Record<string, string>),
      host: undefined,
      referer: "http://www.pixiv.net/",
    };

    this.proxyHelper(uri, headers, res);
  }
}
