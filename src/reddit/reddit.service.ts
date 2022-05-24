import { stringify } from 'querystring'
import { AxiosRequestConfig } from 'axios'
import camelize from 'camelize'

import logger from '../logger'
import config from '../config'
import PageResponse from '../dto/pageResponse'
import AuthResponse from '../dto/authResponse'
import FilterResponse from '../dto/filterResponse'
import ItemResponse from '../dto/itemResponse'
import { Listing, Post } from './dto/redditResponse'
import hosts from './hosts'
import httpService from './reddit.http'

export async function authorize(code: string): Promise<AuthResponse> {
  const body = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost',
  }

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: config.get('REDDIT_CLIENT_ID'),
      password: '',
    },
  }

  const { data } = await httpService.post('https://www.reddit.com/api/v1/access_token', stringify(body), axiosConfig)
  return camelize(data)
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: config.get('REDDIT_CLIENT_ID'),
      password: '',
    },
  }

  const { data } = await httpService.post('https://www.reddit.com/api/v1/access_token', stringify(body), axiosConfig)
  return {
    ...camelize(data),
    refreshToken,
  }
}

// https://www.reddit.com/dev/api/#GET_search
export async function getSearch(
  accessToken: string,
  count: number,
  after: string,
  query: string,
  sort: string,
  filters: string[]
): Promise<PageResponse> {
  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  let path = 'search'
  const params: any = {
    after,
    count,
    q: query,
    limit: 25,
    sort: 'relevance',
    t: 'all',
    restrict_sr: filters.length > 0,
    raw_json: 1, // remove body html encoding
  }

  // parse sort
  if (sort) {
    const [sortValue, t] = sort.split('-')
    if (t) {
      params.t = t
    }

    params.sort = sortValue
  }

  // check if we need to access a user's submitted page
  if (filters.some((filter) => filter.startsWith('user/'))) {
    const user = filters.find((filter) => filter.startsWith('user/'))
    path = `${user}/submitted/${path}`
    params.type = 'links'
  } else {
    // parse filters
    path = combineFiltersWithPath(filters, path)
  }

  const url = `/${path}?${stringify(params)}`
  const { data } = await httpService.get<Listing>(url, axiosConfig)
  return await parseRedditListing(data, count)
}

// https://www.reddit.com/dev/api/#GET_best
export async function getListing(
  accessToken: string,
  count: number,
  after: string,
  sort: string,
  filters: string[]
): Promise<PageResponse> {
  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  // build params
  const params: any = { count, after, t: undefined, raw_json: 1 }

  // parse sort
  let path = 'hot'
  if (sort) {
    const [sortValue, t] = sort.split('-')
    if (t) {
      params.t = t
    }

    path = sortValue
  }

  // check if we need to access a user's submitted page
  if (filters.some((filter) => filter.startsWith('user/'))) {
    const user = filters.find((filter) => filter.startsWith('user/'))
    path = `${user}/submitted/${path}`
    params.type = 'links'
  } else {
    // parse filters
    path = combineFiltersWithPath(filters, path)
  }

  const url = `/${path}?${stringify(params)}`
  const { data } = await httpService.get<Listing>(url, axiosConfig)
  return await parseRedditListing(data, count)
}

export async function filters(accessToken: string, filter: string): Promise<FilterResponse[]> {
  switch (filter) {
    case 'subreddit':
      return getSubreddits(accessToken)
    case 'multireddit':
      return getMultireddits(accessToken)
    case 'user':
      return []
    default:
      logger.error(`Unknown reddit filter: ${filter}`)
      throw new Error('Unknown filter')
  }
}

export async function filtersForItem(accessToken: string, itemId: string): Promise<FilterResponse[]> {
  const article = itemId.replace(/^t[0-9]+_/, '')
  const path = `duplicates/${article}`
  const params: any = {
    after: undefined,
    before: undefined,
    count: undefined,
    crossposts_only: true,
    limit: 100,
    raw_json: 1,
    show: 'all',
    sort: 'new',
    sr: undefined,
    sr_detail: true,
  }

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const url = `/${path}?${stringify(params)}`
  const { data: listings } = await httpService.get(url, axiosConfig)
  return listings.reduce((accFilters, listing) => {
    const { data, kind } = listing
    const { children } = data

    const listingFilters = children.map((child): FilterResponse => {
      if (kind !== 'Listing') {
        logger.warn(`Unknown reddit listing kind: ${kind}`)
        throw new Error(`Unable to parse Reddit response. Unknown listing kind ${kind}`)
      }

      if (child.kind !== 't3') {
        logger.warn(`Unknown reddit child kind: ${child.kind}`)
        throw new Error(`Unable to parse Reddit response. Unknown child kind ${child.kind}`)
      }

      return {
        id: child.data.subreddit_name_prefixed,
        name: child.data.subreddit,
        filterSectionId: 'subreddit',
      }
    })

    return [...accFilters, ...listingFilters]
  }, [])
}

/** parses a listing type response form reddit */
async function parseRedditListing(listing: Listing, count: number): Promise<PageResponse> {
  const { data, kind } = listing
  if (kind !== 'Listing') {
    logger.error(`Unknown reddit listing kind: ${kind}`)
    throw new Error('Unable to parse Reddit response')
  }

  const { children, after } = data
  const items = await Promise.all<ItemResponse>(children.map(parseRedditPost))
  return {
    hasNext: Boolean(after),
    offset: children.length + count,
    after,
    items: items.filter(Boolean),
  }
}

/** parses a post type response from reddit */
async function parseRedditPost(post: Post): Promise<ItemResponse> {
  const { data, kind } = post
  if (kind !== 't3') {
    logger.warn(`Unknown reddit post kind: ${kind}`)
    return null
  }

  return hosts.resolve(data, httpService, logger)
}

async function getSubreddits(accessToken: string): Promise<FilterResponse[]> {
  const path = 'subreddits/mine/subscriber'
  const params: any = {
    raw_json: 1,
    after: undefined,
    count: 0,
    limit: 100,
    show: 'all',
    sr_detail: true,
  }

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  let subreddits: FilterResponse[] = []
  while (true) {
    // get page
    const response = await httpService.get(`/${path}?${stringify(params)}`, axiosConfig)

    // parse response
    const listing = response.data
    const { data, kind } = listing
    const { after, children } = data

    // sanity check
    if (kind !== 'Listing') {
      logger.warn(`Unknown reddit listing kind: ${kind}`)
      throw new Error(`Unable to parse Reddit response. Unknown listing kind ${kind}`)
    }

    // add subreddits to resulting array
    subreddits = [
      ...subreddits,
      ...children.map(
        (child) =>
          ({
            id: child.data.url,
            name: child.data.display_name,
            filterSectionId: 'subreddit',
          } as FilterResponse)
      ),
    ]

    // check if there's a next page
    if (!after || children.length === 0) {
      break
    }

    // set up for next page
    params.count += children.length
    params.after = after
  }

  return subreddits
}

async function getMultireddits(accessToken: string): Promise<FilterResponse[]> {
  const path = 'api/multi/mine'
  const params: any = { raw_json: 1, expand_srs: true }
  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const url = `/${path}?${stringify(params)}`
  const { data: listing } = await httpService.get(url, axiosConfig)
  const { kind } = listing
  return listing.map((multiLabel): FilterResponse => {
    if (multiLabel.kind !== 'LabeledMulti') {
      logger.warn(`Unknown reddit label kind: ${kind}`)
      throw new Error(`Unable to parse Reddit response. Unknown label kind ${kind}`)
    }

    return {
      id: multiLabel.data.path,
      name: multiLabel.data.name,
      filterSectionId: 'multireddit',
    }
  })
}

function combineFiltersWithPath(filters: string[], path: string) {
  if (filters.length > 1) {
    const pathPart = filters
      .map((filter) =>
        filter
          .replace(/(^\/|\/$)/g, '')
          .replace(/^u\//i, 'u_')
          .replace(/^r\//i, '')
      )
      .join('+')
    path = `r/${pathPart}/${path}`
  } else if (filters.length === 1) {
    const pathPart = filters[0].replace(/(^\/|\/$)/g, '')
    path = `${pathPart}/${path}`
  }

  return path
}
