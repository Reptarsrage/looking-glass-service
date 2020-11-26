export interface Media {
  frames: string
  hash: string
  height: string
  mp4: string
  mp4_size: string
  size: string
  url: string
  webp: string
  webp_size: string
  width: string
}

export interface Images {
  downsized_large: Media
  fixed_height_small_still: Media
  original: Media
  fixed_height_downsampled: Media
  downsized_still: Media
  fixed_height_still: Media
  downsized_medium: Media
  downsized: Media
  preview_webp: Media
  original_mp4: Media
  fixed_height_small: Media
  fixed_height: Media
  downsized_small: Media
  preview: Media
  fixed_width_downsampled: Media
  fixed_width_small_still: Media
  fixed_width_small: Media
  original_still: Media
  fixed_width_still: Media
  looping: Media
  fixed_width: Media
  preview_gif: Media
  '480w_still': Media
}

export interface User {
  avatar_url: string
  banner_image: string
  banner_url: string
  profile_url: string
  username: string
  display_name: string
  description: string
  is_verified: boolean
  website_url: string
  instagram_url: string
}

export interface Datum {
  type: string
  id: string
  url: string
  slug: string
  bitly_gif_url: string
  bitly_url: string
  embed_url: string
  username: string
  source: string
  title: string
  rating: string
  content_url: string
  source_tld: string
  source_post_url: string
  is_sticker: number
  import_datetime: string
  trending_datetime: string
  images: Images
  user: User
}

export interface Meta {
  status: number
  msg: string
  response_id: string
}

export interface GiphyResponse {
  data: Datum
  meta: Meta
}
