export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface Variant {
  source: Source;
  resolutions: Source[];
}

export interface Variants {
  mp4: Variant;
  gif: Variant;
}

export interface Image {
  source: Source;
  resolutions: Source[];
  variants: Variants;
}

export interface Preview {
  images: Image[];
  reddit_video_preview: RedditVideo;
  enabled: boolean;
}

export interface RedditVideo {
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}

export interface Embedded {
  thumbnail_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
}

export interface Media {
  reddit_video: RedditVideo;
  oembed: Embedded;
}

export interface PostData {
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  gilded: number;
  clicked: boolean;
  title: string;
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_interface: string;
  downs: number;
  thumbnail_height?: number;
  top_awarded_type: string;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  upvote_ratio: number;
  author_flair_background_color: string;
  subreddit_type: string;
  ups: number;
  total_awards_received: number;
  thumbnail_width?: number;
  author_flair_template_id: string;
  is_original_content: boolean;
  secure_media: Media;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  link_flair_text: string;
  can_mod_post: boolean;
  score: number;
  author_premium: boolean;
  thumbnail: string;
  author_flair_css_interface: string;
  post_hint: string;
  is_self: boolean;
  created: number;
  link_flair_type: string;
  wls: number;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html: string;
  suggested_sort: string;
  url_overridden_by_dest: string;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  media_only: boolean;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: string;
  visited: boolean;
  subreddit_id: string;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  author: string;
  num_comments: number;
  send_replies: boolean;
  whitelist_status: string;
  contest_mode: boolean;
  author_patreon_flair: boolean;
  author_flair_text_color: string;
  permalink: string;
  parent_whitelist_status: string;
  stickied: boolean;
  url: string;
  display_name: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  media: Media;
  is_video: boolean;
  link_flair_template_id: string;
}

export interface SubredditData {
  url: string;
  display_name: string;
}

export interface MultiRedditData {
  path: string;
  name: string;
}

export interface Post {
  kind: "t3";
  data: PostData;
}

export interface Subreddit {
  kind: "t5";
  data: SubredditData;
}

export interface MultiReddit {
  kind: "LabeledMulti";
  data: MultiRedditData;
}

export interface ListingData {
  children: (Post | Subreddit)[];
  after: string;
}

export interface Listing {
  kind: "Listing";
  data: ListingData;
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
