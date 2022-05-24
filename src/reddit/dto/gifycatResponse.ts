export interface Media {
  url: string;
  size: number;
  width: number;
  height: number;
}

export interface ContentUrls {
  "100pxGif": Media;
  largeGif: Media;
  max1mbGif: Media;
  max2mbGif: Media;
  max5mbGif: Media;
  mobile: Media;
  mobilePoster: Media;
  mp4: Media;
  webm: Media;
  webp: Media;
}

export interface UserData {
  followers: number;
  following: number;
  name: string;
  profileImageUrl: string;
  profileUrl: string;
  subscription: number;
  url: string;
  username: string;
  verified: boolean;
  views: number;
}

export interface GfyItem {
  avgColor: string;
  content_urls: ContentUrls;
  createDate: number;
  description: string;
  dislikes: number;
  extraLemmas: string;
  frameRate: number;
  gatekeeper: number;
  gfyId: string;
  gfyName: string;
  gfyNumber: string;
  gfySlug: string;
  gif100px: string;
  gifUrl: string;
  hasAudio: boolean;
  hasTransparency: boolean;
  height: number;
  languageCategories: string[];
  languageText: string;
  likes: number;
  max1mbGif: string;
  max2mbGif: string;
  max5mbGif: string;
  md5: string;
  miniPosterUrl: string;
  miniUrl: string;
  mobilePosterUrl: string;
  mobileUrl: string;
  mp4Size: number;
  mp4Url: string;
  nsfw: number;
  numFrames: number;
  posterUrl: string;
  published: number;
  sitename: string;
  source: number;
  tags: string[];
  thumb100PosterUrl: string;
  title: string;
  userData: UserData;
  userDisplayName: string;
  username: string;
  userProfileImageUrl: string;
  views: number;
  webmSize: number;
  webmUrl: string;
  webpUrl: string;
  width: number;
}

export interface GfyResponse {
  gfyItem: GfyItem;
}
