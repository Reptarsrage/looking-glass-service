import { AxiosInstance } from 'axios'

import { Logger } from 'src/logger'
import { PostData } from 'src/reddit/dto/redditResponse'
import { GfyResponse } from 'src/reddit/dto/gifycatResponse'
import ItemResponse from 'src/dto/itemResponse'
import { Host } from 'src/reddit/dto/redditHost'

export default class GfycatHost implements Host {
  domains: RegExp[] = [/gfycat\.com/i]

  async resolve(data: PostData, httpService: AxiosInstance, logger: Logger): Promise<ItemResponse> {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url } = data
    const date = new Date(created_utc * 1000).toISOString()

    const gfyId = url
      .split('?')[0] // get rid of query string
      .split('/') // split on path
      .slice(-1)[0] // get last part of path

    try {
      // hit up the Gfycat API
      // see https://developers.gfycat.com/api/#getting-gfycats
      const response = await httpService.get<GfyResponse>(`https://api.gfycat.com/v1/gfycats/${gfyId}`)

      // parse response
      const { gfyItem } = response.data
      const { width, height, posterUrl, mobilePosterUrl, miniPosterUrl, thumb100PosterUrl, content_urls } = gfyItem
      const poster = posterUrl || mobilePosterUrl || miniPosterUrl || thumb100PosterUrl
      const { mp4, mobile, webm, webp } = content_urls
      const urls = [mp4, mobile, webm, webp].filter(Boolean)

      return {
        id: name,
        title: title,
        date,
        author: {
          id: `u/${author}`,
          filterSectionId: 'user',
          name: author,
        },
        source: {
          id: subreddit_name_prefixed,
          filterSectionId: 'subreddit',
          name: subreddit,
        },
        width,
        height,
        urls,
        poster,
        isVideo: true,
        isGallery: false,
        filters: [
          {
            id: subreddit_name_prefixed,
            filterSectionId: 'subreddit',
            name: subreddit,
          },
          {
            id: `u/${author}`,
            filterSectionId: 'user',
            name: author,
          },
        ],
      }
    } catch (error) {
      logger.warn(`Error fetching Gfycat item ${url}\n${error}`)
      return null
    }
  }
}
