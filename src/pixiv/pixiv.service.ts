// see: https://github.com/Pixeval/Pixeval/
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import camelize from 'camelize'
import decamelize from 'decamelize-keys'
import { stringify } from 'querystring'

import PageResponse from '../dto/pageResponse'
import AuthResponse from '../dto/authResponse'
import FilterResponse from '../dto/filterResponse'
import ItemResponse from '../dto/itemResponse'
import MediaResponse from '../dto/mediaResponse'
import config from '../config'
import httpService from './pixiv.http'
import { PixivIllust, PixivIllustDetail, PixivIllustSearch } from './dto/illustSearchResponse'
import challenge from './pixiv.verifier'

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const authTokenUrl = 'https://oauth.secure.pixiv.net/auth/token'
  const body: any = {
    clientId: config.get('PIXIV_CLIENT_ID'),
    clientSecret: config.get('PIXIV_CLIENT_SECRET'),
    grantType: 'refresh_token',
    includePolicy: 'true',
    refreshToken,
  }

  const { data } = await httpService.post(authTokenUrl, stringify(decamelize(body)))
  return camelize(data)
}

export async function authorize(code: string): Promise<AuthResponse> {
  const redirectUri = 'https://app-api.pixiv.net/web/v1/users/auth/pixiv/callback'
  const authTokenUrl = 'https://oauth.secure.pixiv.net/auth/token'
  const body: any = {
    clientId: config.get('PIXIV_CLIENT_ID'),
    clientSecret: config.get('PIXIV_CLIENT_SECRET'),
    code,
    codeVerifier: challenge.codeVerifier,
    grantType: 'authorization_code',
    includePolicy: 'true',
    redirectUri: redirectUri,
  }

  const { data } = await httpService.post(authTokenUrl, stringify(decamelize(body)))
  return camelize(data)
}

export async function filters(accessToken: string, filter: string): Promise<FilterResponse[]> {
  switch (filter) {
    case 'tag':
      return getTags(accessToken)
    default:
      throw new Error('Unknown filter')
  }
}

export async function searchIllust(
  accessToken: string,
  host: string,
  offset: number,
  filters: string[],
  query?: string
): Promise<PageResponse> {
  const params = {
    offset,
    sort: 'date_desc',
    filter: 'for_ios',
    include_translated_tag_results: 'true',
    word: query,
    search_target: 'partial_match_for_tags',
  }

  if (filters.length > 0) {
    params.search_target = 'exact_match_for_tags'
    params.word = filters.join(' ') // for multiple filters join with space between
  }

  const { data } = await fetch('/v1/search/illust', accessToken, { params })
  return parseContentPage(camelize(data), host, offset)
}

export async function getContentPage(
  accessToken: string,
  host: string,
  offset: number,
  sort?: string
): Promise<PageResponse> {
  const params = {
    restrict: 'all',
    offset,
    filter: 'for_ios',
  }

  let url
  const sortVal = sort ?? 'following'
  const [feed, contentType] = sortVal.split('-')
  if (feed === 'recommended') {
    url = `/v1/${contentType}/recommended`
  } else if (feed === 'following') {
    url = '/v2/illust/follow'
  } else {
    throw new Error('Unknown sort')
  }

  const { data } = await fetch(url, accessToken, { params })
  return parseContentPage(camelize(data), host, offset)
}

export async function getGalleryPage(
  accessToken: string,
  host: string,
  galleryId: string | number,
  offset: number
): Promise<PageResponse> {
  const params = {
    restrict: 'all',
    illust_id: galleryId,
  }

  const { data } = await fetch('/v1/illust/detail', accessToken, { params })
  return parseGalleryPage(camelize(data), host, offset)
}

function parseGalleryPage(data: PixivIllustDetail, host: string, offset: number): PageResponse {
  const { illust } = data
  const { metaPages, id, width, height } = illust
  const parent = parseIllust(illust, host)

  return {
    hasNext: false,
    offset: offset + metaPages.length,
    after: undefined,
    items: metaPages.map(
      (illust, i): ItemResponse => ({
        ...parent,
        id: `${id}_${i}`,
        isGallery: false,
        urls: [
          genImage(host, Infinity, width, height, illust.imageUrls.original),
          genImage(host, 600, width, height, illust.imageUrls.large),
          genImage(host, 540, width, height, illust.imageUrls.medium),
        ].filter(Boolean),
      })
    ),
  }
}

function parseContentPage(data: PixivIllustSearch, host: string, offset: number): PageResponse {
  return {
    hasNext: data && typeof data.nextUrl === 'string' && data.nextUrl.length > 0,
    offset: offset + data.illusts.length,
    after: undefined,
    items: data.illusts.map((illust) => parseIllust(illust, host)),
  }
}

function genImage(
  host: string,
  size: number,
  image_width: number,
  image_height: number,
  uri?: string
): MediaResponse | undefined {
  if (!uri) {
    return
  }

  let width = Math.min(image_width, size)
  let height = Math.min(image_height, size)
  if (image_width > image_height) {
    width = (image_height / image_width) * width
  } else {
    height = (image_width / image_height) * height
  }

  return { url: `http://${host}/pixiv/proxy?${stringify({ uri })}`, width, height }
}

function parseIllust(illust: PixivIllust, host: string): ItemResponse {
  return {
    id: illust.id.toString(),
    name: illust.title,
    urls: [
      genImage(host, Infinity, illust.width, illust.height, illust.metaSinglePage?.originalImageUrl),
      genImage(host, Infinity, illust.width, illust.height, illust.imageUrls.original),
      genImage(host, 600, illust.width, illust.height, illust.imageUrls.large),
      genImage(host, 540, illust.width, illust.height, illust.imageUrls.medium),
    ].filter(Boolean),
    width: illust.width,
    height: illust.height,
    isVideo: false,
    isGallery: Array.isArray(illust.metaPages) && illust.metaPages.length > 0,
    filters: illust.tags.map(
      (tag: any): FilterResponse => ({
        id: tag.name,
        filterSectionId: 'tag',
        name: tag.translated_name || tag.name,
      })
    ),
  }
}

async function getTags(accessToken: string): Promise<FilterResponse[]> {
  const params = {
    filter: 'for_ios',
  }

  const response = await fetch('/v1/trending-tags/illust', accessToken, { params })
  return parseTags(response)
}

function parseTags(response: AxiosResponse): FilterResponse[] {
  const { data } = response
  const { trend_tags } = data

  return trend_tags.map((tag) => ({
    id: tag.tag,
    name: tag.translated_name || tag.tag,
  }))
}

function fetch<T>(target: string, accessToken?: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  options = options || { method: 'GET' }

  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    }
  }

  if (options.data) {
    options.method = 'POST'
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    options.data = stringify(options.data)
  }

  options.url = target
  return httpService.request<T>(options)
}
