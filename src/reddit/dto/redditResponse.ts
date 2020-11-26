export interface Source {
  url: string
  width: number
  height: number
}

export interface Variant {
  source: Source
  resolutions: Source[]
}

export interface Variants {
  mp4: Variant
  gif: Variant
}

export interface Image {
  source: Source
  resolutions: Source[]
  variants: Variants
}

export interface Preview {
  images: Image[]
  reddit_video_preview: RedditVideo
  enabled: boolean
}

export interface RedditVideo {
  fallback_url: string
  height: number
  width: number
  scrubber_media_url: string
  dash_url: string
  duration: number
  hls_url: string
  is_gif: boolean
  transcoding_status: string
}

export interface Embedded {
  thumbnail_url: string
  thumbnail_height: number
  thumbnail_width: number
}

export interface Media {
  reddit_video: RedditVideo
  oembed: Embedded
}

export interface PostData {
  approved_at_utc?: any
  subreddit: string
  selftext: string
  author_fullname: string
  saved: boolean
  mod_reason_title?: any
  gilded: number
  clicked: boolean
  title: string
  subreddit_name_prefixed: string
  hidden: boolean
  pwls: number
  link_flair_css_interface: string
  downs: number
  thumbnail_height?: number
  top_awarded_type: string
  hide_score: boolean
  name: string
  quarantine: boolean
  link_flair_text_color: string
  upvote_ratio: number
  author_flair_background_color: string
  subreddit_type: string
  ups: number
  total_awards_received: number
  thumbnail_width?: number
  author_flair_template_id: string
  is_original_content: boolean
  user_reports: any[]
  secure_media: Media
  is_reddit_media_domain: boolean
  is_meta: boolean
  category?: any
  link_flair_text: string
  can_mod_post: boolean
  score: number
  approved_by?: any
  author_premium: boolean
  thumbnail: string
  edited: any
  author_flair_css_interface: string
  post_hint: string
  content_categories?: any
  is_self: boolean
  mod_note?: any
  created: number
  link_flair_type: string
  wls: number
  removed_by_category?: any
  banned_by?: any
  author_flair_type: string
  domain: string
  allow_live_comments: boolean
  selftext_html: string
  likes?: any
  suggested_sort: string
  banned_at_utc?: any
  url_overridden_by_dest: string
  view_count?: any
  archived: boolean
  no_follow: boolean
  is_crosspostable: boolean
  pinned: boolean
  over_18: boolean
  preview: Preview
  awarders: any[]
  media_only: boolean
  can_gild: boolean
  spoiler: boolean
  locked: boolean
  author_flair_text: string
  treatment_tags: any[]
  visited: boolean
  removed_by?: any
  num_reports?: any
  distinguished?: any
  subreddit_id: string
  mod_reason_by?: any
  removal_reason?: any
  link_flair_background_color: string
  id: string
  is_robot_indexable: boolean
  report_reasons?: any
  author: string
  discussion_type?: any
  num_comments: number
  send_replies: boolean
  whitelist_status: string
  contest_mode: boolean
  mod_reports: any[]
  author_patreon_flair: boolean
  author_flair_text_color: string
  permalink: string
  parent_whitelist_status: string
  stickied: boolean
  url: string
  subreddit_subscribers: number
  created_utc: number
  num_crossposts: number
  media: Media
  is_video: boolean
  link_flair_template_id: string
}

export interface Post {
  kind: string
  data: PostData
}

export interface ListingData {
  modhash?: any
  dist: number
  children: Post[]
  after: string
  before?: any
}

export interface Listing {
  kind: string
  data: ListingData
}
