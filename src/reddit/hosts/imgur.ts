import { extname } from 'path'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { Logger } from 'src/logger'
import config from 'src/config'
import { ImgurImageResponse } from 'src/reddit/dto/imgurImageResponse'
import { PostData } from 'src/reddit/dto/redditResponse'
import ItemResponse from 'src/dto/itemResponse'
import { Host } from 'src/reddit/dto/redditHost'

export default class ImgurHost implements Host {
  domains: RegExp[] = [/imgur\.com/i]

  async resolve(data: PostData, httpService: AxiosInstance, logger: Logger): Promise<ItemResponse> {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url } = data
    const date = new Date(created_utc * 1000).toISOString()

    // url could be one of
    //  image: /<ID>.<EXT>
    //  gallery: /gallery/<ID>
    //  album: /a/<ID>

    const type = url
      .split('?')[0] // remove query string
      .split('/') // split by path
      .slice(-2)[0] // take second to last path part

    const imgurId = url
      .split('?')[0] // remove query string
      .split('/') // split by path
      .slice(-1)[0] // take last path part
      .split('.')[0] // remove extension

    // TODO: Support Imgur albums
    // see: https://apidocs.imgur.com/#5369b915-ad8b-47b1-b44b-8e2561e41cee
    if (type === 'a') {
      logger.warn('Imgur albums not currently supported')
      return null
    }

    // TODO: Support Imgur galleries
    // see: https://apidocs.imgur.com/#eff60e84-5781-4c12-926a-208dc4c7cc94
    if (type === 'gallery') {
      logger.warn('Imgur galleries not currently supported')
      return null
    }

    // hit up imgur API
    // see https://apidocs.imgur.com/#2078c7e0-c2b8-4bc8-a646-6e544b087d0f
    const imgurApiUrl = `https://api.imgur.com/3/image/${imgurId}`
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Client-ID ${config.get('IMGUR_CLIENT_ID')}`,
      },
    }

    try {
      const response = await httpService.get<ImgurImageResponse>(imgurApiUrl, axiosConfig)

      // parse response
      const { type, width, height, link } = response.data.data
      const isVideo = type.startsWith('video') // mime type
      const ext = extname(link)
      const poster = isVideo ? link.replace(ext, '.jpg') : undefined
      const urls = [{ url: link, width, height }]

      return {
        id: name,
        name: title,
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
        isVideo,
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
      logger.warn(`Error fetching Imgur item ${url}\n${error}`)
      return null
    }
  }
}
