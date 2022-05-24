export interface Processing {
  status: string;
}

export interface Data {
  id: string;
  title?: string;
  description: string;
  datetime: number;
  type: string;
  animated: boolean;
  width: number;
  height: number;
  size: number;
  views: number;
  bandwidth: number;
  favorite: boolean;
  nsfw: boolean;
  section: string;
  is_ad: boolean;
  in_most_viral: boolean;
  has_sound: boolean;
  tags: string[];
  ad_type: number;
  ad_url: string;
  edited: string;
  in_gallery: boolean;
  link: string;
  mp4_size: number;
  mp4: string;
  gifv: string;
  hls: string;
  processing: Processing;
}

export interface ImgurImageResponse {
  data: Data;
  success: boolean;
  status: number;
}
