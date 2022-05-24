export interface PixivUser {
  id: number;
  name: string;
  account: string;
  profile_image_urls: {
    medium: string;
  };
  comment: string;
  is_followed: boolean;
}

export interface PixivTag {
  name: string;
  translated_name: string | null;
  added_by_uploaded_user?: boolean;
  illust?: PixivIllust;
  is_registered?: boolean;
}

export interface PixivMetaPage {
  image_urls: ImageUrls;
}

export interface ImageUrls {
  square_medium: string;
  medium: string;
  large: string;
  original: string;
}

export interface PixivIllust {
  id: number;
  title: string;
  type: string;
  image_urls: ImageUrls;
  caption: string;
  restrict: number;
  user: PixivUser;
  tags: PixivTag[];
  tools: string[];
  create_date: string;
  page_count: number;
  width: number;
  height: number;
  sanity_level: number;
  meta_single_page: {
    original_image_url?: string;
  };
  meta_pages: PixivMetaPage[];
  total_view: number;
  total_bookmarks: number;
  is_bookmarked: boolean;
  visible: boolean;
  is_muted: boolean;
  total_comments: number;
}

export interface PixivIllustSearch {
  illusts: PixivIllust[];
  next_url: string | null;
  search_span_limit?: number;
}

export interface PixivIllustDetail {
  illust: PixivIllust;
}

export interface Tag {
  tag: string;
  translated_name: string | null;
}

export interface PixivTagsResponse {
  trend_tags: Tag[];
}
