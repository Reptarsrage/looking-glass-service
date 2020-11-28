import { AxiosInstance } from 'axios'

import { Logger } from 'src/logger'
import { PostData } from 'src/reddit/dto/redditResponse'
import ItemResponse from 'src/dto/itemResponse'
import { Host } from 'src/reddit/dto/redditHost'
import MediaResponse from 'src/dto/mediaResponse'

export default class RedditHost implements Host {
  domains: RegExp[] = [/\.redd\.it/i, /reddit\.com/i]

  resolve(data: PostData, httpService: AxiosInstance, logger: Logger): Promise<ItemResponse> {
    const {
      preview,
      name,
      title,
      author,
      subreddit,
      subreddit_name_prefixed,
      created_utc,
      secure_media,
      media,
      thumbnail,
      thumbnail_height,
      thumbnail_width,
      url,
    } = data

    const date = new Date(created_utc * 1000).toISOString()
    let urls: MediaResponse[] = []
    let width = 0
    let height = 0
    let poster: string = undefined
    let isVideo = false

    const { images = [], reddit_video_preview } = preview || {}

    const hasRedditVideoPreview = Boolean(reddit_video_preview)
    const hasMp4PreviewVariant = images.length > 0 && images[0].variants && Boolean(images[0].variants.mp4)
    const hasGifPreviewVariant = images.length > 0 && images[0].variants && Boolean(images[0].variants.gif)
    const { reddit_video, oembed } = secure_media || media || {}
    const hasRedditVideo = Boolean(reddit_video)
    const hasPreviewImageSource = images.length > 0 && Boolean(images[0].source)
    const hasPreviewImageResolutions =
      images.length > 0 && Array.isArray(images[0].resolutions) && images[0].resolutions.length > 0
    const hasThumbnail = Boolean(thumbnail) && Boolean(thumbnail_height) && Boolean(thumbnail_width)
    const hasEmbeddedThumbnail = Boolean(oembed) && Boolean(oembed.thumbnail_url)

    // look up best image to use for poster
    let bestPoster = null
    if (images.length > 0) {
      const { source, resolutions } = images[0]
      const bestImage = source || resolutions.reduce((acc, cur) => (!acc || cur.width > acc.width ? cur : acc), null)
      if (bestImage) {
        bestPoster = bestImage.url
      }
    }

    if (hasRedditVideo) {
      // parse reddit video
      isVideo = true
      poster = bestPoster
      width = reddit_video.width
      height = reddit_video.height
      urls = [
        { url: reddit_video.fallback_url, width, height },
        { url: reddit_video.scrubber_media_url, width: 0, height: 0 },
      ].filter(({ url }) => Boolean(url))
    } else if (hasMp4PreviewVariant) {
      // parse reddit preview variant
      isVideo = true
      poster = bestPoster
      const { source, resolutions } = images[0].variants.mp4
      const bestVideo = source || resolutions.reduce((acc, cur) => (!acc || cur.width > acc.width ? cur : acc), null)
      width = bestVideo.width
      height = bestVideo.height
      urls = (resolutions || [source]).filter(({ url }) => Boolean(url))
    } else if (hasRedditVideoPreview) {
      // parse reddit preview video
      isVideo = true
      poster = bestPoster
      width = reddit_video_preview.width
      height = reddit_video_preview.height
      urls = [
        { url: reddit_video_preview.fallback_url, width, height },
        { url: reddit_video_preview.scrubber_media_url, width: 0, height: 0 },
      ].filter(({ url }) => Boolean(url))
    } else if (hasGifPreviewVariant) {
      // parse image preview gif variant
      isVideo = false
      const { source, resolutions } = images[0].variants.gif
      const bestGif = source || resolutions.reduce((acc, cur) => (!acc || cur.width > acc.width ? cur : acc), null)
      width = bestGif.width
      height = bestGif.height
      urls = (resolutions || [source]).filter(({ url }) => Boolean(url))
    } else if (hasPreviewImageSource || hasPreviewImageResolutions) {
      // parse image the best we can
      isVideo = false
      const { source, resolutions } = images[0]
      const bestImage = hasPreviewImageSource
        ? source
        : resolutions.reduce((acc, cur) => (!acc || cur.width > acc.width ? cur : acc), null)
      width = bestImage.width
      height = bestImage.height
      urls = (hasPreviewImageResolutions ? resolutions : [source]).filter(({ url }) => Boolean(url))
    } else if (hasThumbnail) {
      // parse thumbnail the best we can
      isVideo = false
      width = thumbnail_width
      height = thumbnail_height
      urls = [{ url: thumbnail, width, height }]
    } else if (hasEmbeddedThumbnail) {
      // parse embedded thumbnail the best we can
      isVideo = false
      width = oembed.thumbnail_width
      height = oembed.thumbnail_height
      urls = [{ url: oembed.thumbnail_url, width, height }]
    } else {
      logger.warn(`Unable to parse reddit post using fallback logic ${url}`)
      return null
    }

    if (!width || !height) {
      return null
    }

    const itemResponse: ItemResponse = {
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

    return Promise.resolve(itemResponse)
  }
}
