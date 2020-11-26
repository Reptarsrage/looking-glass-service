import { AxiosRequestConfig, AxiosResponse } from 'axios'
import camelize from 'camelize'
import * as crypto from 'crypto'
import decamelize from 'decamelize-keys'
import moment from 'moment'
import { stringify } from 'querystring'

import config from 'src/config'
import PageResponse from 'src/dto/pageResponse'
import AuthResponse from 'src/dto/authResponse'
import FilterResponse from 'src/dto/filterResponse'
import ItemResponse from 'src/dto/itemResponse'
import MediaResponse from 'src/dto/mediaResponse'
import httpService from './pixiv.http'
import { PixivIllust, PixivIllustDetail, PixivIllustSearch } from './dto/illustSearchResponse'

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const time = moment().format('YYYY-MM-DDTHH:mm:ss+00:00')
  const hashSecret = config.get('PIXIV_HASH_SECRET')

  const timeHash = crypto
    .createHash('md5')
    .update(Buffer.from(`${time}${hashSecret}`, 'utf8'))
    .digest('hex')

  const requestConfig: AxiosRequestConfig = {
    headers: {
      'X-Client-Time': time,
      'X-Client-Hash': timeHash,
    },
  }

  const body: any = {
    clientId: config.get('PIXIV_CLIENT_ID'),
    clientSecret: config.get('PIXIV_CLIENT_SECRET'),
    get_secure_url: '1',
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  const { data } = await httpService.post(
    'https://oauth.secure.pixiv.net/auth/token',
    stringify(decamelize(body)),
    requestConfig
  )

  return camelize(data)
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const time = moment().format('YYYY-MM-DDTHH:mm:ss+00:00')
  const hashSecret = config.get('PIXIV_HASH_SECRET')

  const timeHash = crypto
    .createHash('md5')
    .update(Buffer.from(`${time}${hashSecret}`, 'utf8'))
    .digest('hex')

  const requestConfig: AxiosRequestConfig = {
    headers: {
      'X-Client-Time': time,
      'X-Client-Hash': timeHash,
    },
  }

  const body: any = {
    clientId: config.get('PIXIV_CLIENT_ID'),
    clientSecret: config.get('PIXIV_CLIENT_SECRET'),
    get_secure_url: '1',
    grant_type: 'password',
    username: username,
    password: password,
  }

  const { data } = await httpService.post(
    'https://oauth.secure.pixiv.net/auth/token',
    stringify(decamelize(body)),
    requestConfig
  )

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
  query?: string,
  filter?: string
): Promise<PageResponse> {
  const params = {
    offset,
    sort: 'date_desc',
    filter: 'for_ios',
    include_translated_tag_results: 'true',
    word: query,
    search_target: 'partial_match_for_tags',
  }

  if (filter) {
    params.search_target = 'exact_match_for_tags'
    params.word = filter // for multiple filters join with space between
  }

  const { data } = await fetch('/v1/search/illust', accessToken, { params })
  return parseContentPage(camelize(data), host, offset)
}

export async function getContentPage(
  accessToken: string,
  host: string,
  offset: number,
  sort: string
): Promise<PageResponse> {
  const params = {
    restrict: 'all',
    offset,
    filter: 'for_ios',
  }

  let url
  const [feed, contentType] = sort.split('-')
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
          illust.imageUrls.original,
          illust.imageUrls.large,
          illust.imageUrls.medium,
          illust.imageUrls.squareMedium,
        ]
          .filter(Boolean)
          .map(
            (uri, idx): MediaResponse => ({
              url: `http://${host}/pixiv/proxy?${stringify({ uri })}`,
              width: idx === 0 ? width : 0,
              height: idx === 0 ? height : 0,
            })
          ),
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

function parseIllust(illust: PixivIllust, host: string): ItemResponse {
  return {
    id: illust.id.toString(),
    title: illust.title,
    urls: [
      illust.metaSinglePage && illust.metaSinglePage.originalImageUrl,
      illust.imageUrls.original,
      illust.imageUrls.large,
      illust.imageUrls.medium,
      illust.imageUrls.squareMedium,
    ]
      .filter(Boolean)
      .map(
        (uri, idx): MediaResponse => ({
          url: `http://${host}/pixiv/proxy?${stringify({ uri })}`,
          width: idx === 0 ? illust.width : 0,
          height: idx === 0 ? illust.height : 0,
        })
      ),
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
