import { stringify } from 'querystring'
import { AxiosInstance } from 'axios'

import { Logger } from 'src/logger'
import config from 'src/config'
import { GiphyResponse } from 'src/reddit/dto/giphyResponse'
import { PostData } from 'src/reddit/dto/redditResponse'
import ItemResponse from 'src/dto/itemResponse'
import { Host } from 'src/reddit/dto/redditHost'

export default class GiphyHost implements Host {
  domains: RegExp[] = [/giphy\.com/i]

  async resolve(post: PostData, httpService: AxiosInstance, logger: Logger): Promise<ItemResponse> {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url } = post
    const date = new Date(created_utc * 1000).toISOString()

    const gihpyId = url
      .split('?')[0] // remove query string
      .split('/') // split on paths
      .slice(-1)[0] // get last path part
      .split('-') // split giphy id
      .slice(-1)[0] // take the last id part

    try {
      // hit up the Giphy API
      // see https://developers.giphy.com/docs/api/endpoint#get-gif-by-id
      const params: any = { api_key: config.get('GIPHY_API_KEY') }
      const apiUrl = `https://api.giphy.com/v1/gifs/${gihpyId}?${stringify(params)}`
      const response = await httpService.get<GiphyResponse>(apiUrl)

      // parse response
      const { images } = response.data.data
      const stills = Object.keys(images)
        .filter((key) => key.endsWith('_still'))
        .map((key) => images[key])
      const mp4s = Object.values(images).filter(({ mp4 }) => Boolean(mp4))

      // sanity check
      if (stills.length === 0 || mp4s.length === 0) {
        return null
      }

      stills.sort((a, b) => a.size - b.size)
      mp4s.sort((a, b) => a.size - b.size)

      const still = stills[0]
      const mp4 = mp4s[0]
      const { width, height } = mp4
      const poster = still

      // TODO: GIPHY urls require some transformation
      // for example given: https://media4.giphy.com/media/rIaxxamewrBiE/giphy_s.gif?cid=e1bb72ffe930515271c174e23d58c24fcf09a65044d82fd2&rid=giphy_s.gif
      // we want to transform it into https://i.giphy.com/media/rIaxxamewrBiE/giphy_s.gif

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
        urls: mp4s,
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
      logger.warn(`Error fetching Giphy item ${url}\n${error}`)
      return null
    }
  }
}
