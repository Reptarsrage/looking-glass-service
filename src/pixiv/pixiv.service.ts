// see: https://github.com/Pixeval/Pixeval/
import * as cheerio from "cheerio";
import type { AxiosRequestConfig } from "axios";

import { clampImageDimensions, nonNullable, truthy } from "../utils.js";
import type PageResponse from "../dto/pageResponse.js";
import type AuthResponse from "../dto/authResponse.js";
import type FilterResponse from "../dto/filterResponse.js";
import type ItemResponse from "../dto/itemResponse.js";
import type MediaResponse from "../dto/mediaResponse.js";

import challenge from "./pixiv.verifier.js";
import httpService from "./pixiv.http.js";
import type {
  PixivIllust,
  PixivIllustDetail,
  PixivIllustSearch,
  PixivTagsResponse,
} from "./dto/illustSearchResponse.js";
import type { PixivAuthResponse } from "./dto/pixivAuthResponse.js";

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const authTokenUrl = "https://oauth.secure.pixiv.net/auth/token";
  const body = new URLSearchParams([
    ["client_id", process.env.PIXIV_CLIENT_ID ?? ""],
    ["client_secret", process.env.PIXIV_CLIENT_SECRET ?? ""],
    ["grant_type", "refresh_token"],
    ["include_policy", "true"],
    ["refresh_token", refreshToken],
  ]);

  const { data } = await httpService.post<PixivAuthResponse>(authTokenUrl, body);
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
  };
}

export async function authorize(code: string): Promise<AuthResponse> {
  const redirectUri = "https://app-api.pixiv.net/web/v1/users/auth/pixiv/callback";
  const authTokenUrl = "https://oauth.secure.pixiv.net/auth/token";
  const config = {
    headers: {
      "X-Client-Time": new Date().toISOString(),
    },
  };

  const body = new URLSearchParams([
    ["client_id", process.env.PIXIV_CLIENT_ID ?? ""],
    ["client_secret", process.env.PIXIV_CLIENT_SECRET ?? ""],
    ["code", code],
    ["code_verifier", challenge.codeVerifier],
    ["grant_type", "authorization_code"],
    ["include_policy", "true"],
    ["redirect_uri", redirectUri],
  ]);

  const { data } = await httpService.post<PixivAuthResponse>(authTokenUrl, body, config);
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
  };
}

export async function filters(accessToken: string, filter: string): Promise<FilterResponse[]> {
  switch (filter) {
    case "tag":
      return getTags(accessToken);
    case "user":
      return Promise.resolve([]);
    default:
      throw new Error("Unknown filter");
  }
}

export async function searchIllust(
  accessToken: string,
  host: string,
  offset: number,
  filters: string[],
  query?: string
): Promise<PageResponse> {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const params = new URLSearchParams([
    ["offset", offset.toString()],
    ["sort", "date_desc"],
    ["filter", "for_ios"],
    ["include_translated_tag_results", "true"],
    ["search_target", "partial_match_for_tags"],
  ]);

  if (query) {
    params.set("word", query);
  }

  // separate types of filters
  const filtersToApply = filters.filter((filter) => !filter.startsWith("user:"));
  const userFilters = filters.filter((filter) => filter.startsWith("user:")); // should only ever be one

  let url = "/v1/search/illust";
  if (userFilters.length > 0) {
    // we want a specific user's illustrations
    url = "/v1/user/illusts";
    params.set("user_id", userFilters[0].substring(5)); // take first one
  }

  if (filtersToApply.length > 0) {
    // apply filters as search terms
    params.set("search_target", "exact_match_for_tags");
    params.set("word", [...filtersToApply, query].filter(truthy).join(" ")); // for multiple filters join with space between
  }

  const { data } = await httpService.get<PixivIllustSearch>(`${url}?${params.toString()}`, config);
  return parseContentPage(data, host, offset);
}

export async function getContentPage(
  accessToken: string,
  host: string,
  offset: number,
  sort?: string
): Promise<PageResponse> {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const params = new URLSearchParams([
    ["restrict", "all"],
    ["offset", offset.toString()],
    ["filter", "for_ios"],
  ]);

  let url;
  const sortVal = sort || "following";
  const [feed, contentType] = sortVal.split("-");
  if (feed === "recommended") {
    url = `/v1/${contentType}/recommended`;
  } else if (feed === "following") {
    url = "/v2/illust/follow";
  } else {
    throw new Error(`Unknown sort "${sort}"`);
  }

  const { data } = await httpService.get<PixivIllustSearch>(`${url}?${params.toString()}`, config);
  return parseContentPage(data, host, offset);
}

export async function getGalleryPage(
  accessToken: string,
  host: string,
  galleryId: string,
  offset: number
): Promise<PageResponse> {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const params = new URLSearchParams([
    ["restrict", "all"],
    ["illust_id", galleryId],
  ]);

  const { data } = await httpService.get<PixivIllustDetail>(`/v1/illust/detail?${params.toString()}`, config);
  return parseGalleryPage(data, host, offset);
}

function parseGalleryPage(data: PixivIllustDetail, host: string, offset: number): PageResponse {
  const { illust } = data;
  const { meta_pages, id, width, height } = illust;
  const parent = parseIllust(illust, host);

  return {
    hasNext: false,
    offset: offset + meta_pages.length,
    after: undefined,
    items: meta_pages.map(
      (illust, i): ItemResponse => ({
        ...parent,
        id: `${id}_${i}`,
        isGallery: false,
        urls: [
          genImage(host, Infinity, width, height, illust.image_urls.original),
          genImage(host, 600, width, height, illust.image_urls.large),
          genImage(host, 540, width, height, illust.image_urls.medium),
        ].filter(nonNullable),
      })
    ),
  };
}

function parseContentPage(data: PixivIllustSearch, host: string, offset: number): PageResponse {
  return {
    hasNext: data && typeof data.next_url === "string" && data.next_url.length > 0,
    offset: offset + data.illusts.length,
    after: undefined,
    items: data.illusts.map((illust) => parseIllust(illust, host)),
  };
}

function genImage(
  host: string,
  size: number,
  image_width: number,
  image_height: number,
  uri?: string
): MediaResponse | null {
  if (!uri) {
    return null;
  }

  const [width, height] = clampImageDimensions(image_width, image_height, size);
  return { url: `http://${host}/proxy/pixiv?${new URLSearchParams([["uri", uri]]).toString()}`, width, height };
}

function parseIllust(illust: PixivIllust, host: string): ItemResponse {
  const authorFilter = {
    id: `user:${illust.user.id.toString()}`,
    name: illust.user.name,
    filterSectionId: "user",
  };

  return {
    id: illust.id.toString(),
    name: illust.title,
    description: cheerio
      .load(illust.caption || "")("html")
      .text(),
    urls: [
      genImage(host, Infinity, illust.width, illust.height, illust.meta_single_page?.original_image_url),
      genImage(host, Infinity, illust.width, illust.height, illust.image_urls.original),
      genImage(host, 600, illust.width, illust.height, illust.image_urls.large),
      genImage(host, 540, illust.width, illust.height, illust.image_urls.medium),
    ].filter(nonNullable),
    width: illust.width,
    height: illust.height,
    isVideo: false,
    isGallery: Array.isArray(illust.meta_pages) && illust.meta_pages.length > 0,
    filters: illust.tags
      .map(
        (tag): FilterResponse => ({
          id: tag.name,
          filterSectionId: "tag",
          name: tag.translated_name || tag.name,
        })
      )
      .concat(authorFilter),
    date: new Date(illust.create_date).toISOString(),
    author: authorFilter,
  };
}

async function getTags(accessToken: string): Promise<FilterResponse[]> {
  const params = new URLSearchParams([["filter", "for_ios"]]);
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data } = await httpService.get<PixivTagsResponse>(`/v1/trending-tags/illust?${params.toString()}`, config);
  return parseTags(data);
}

function parseTags(data: PixivTagsResponse): FilterResponse[] {
  const { trend_tags } = data;
  return trend_tags.map((tag) => ({
    id: tag.tag,
    name: tag.translated_name ?? tag.tag,
    filterSectionId: "tag",
  }));
}
