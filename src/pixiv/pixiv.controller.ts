import type PageResponse from "../dto/pageResponse";
import type FilterResponse from "../dto/filterResponse";
import ModuleControllerBase, {
  GetAuthorizeParams,
  GetFiltersParams,
  GetProxyParams,
  GetRefreshParams,
} from "../base/base.controller";
import type AuthResponse from "../dto/authResponse";
import type { GetPageParams } from "../base/base.controller";
import definition from "./pixiv.definition";
import * as pixivService from "./pixiv.service";
import { truthy } from "../utils";

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

  override getProxy({ uri, res }: GetProxyParams): void {
    const headers = {
      referer: "http://www.pixiv.net/",
    };

    this.proxyHelper(uri, headers, res);
  }
}
