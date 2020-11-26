export interface Processing {
  status: string
}

export interface AdConfig {
  safeFlags: string[]
  highRiskFlags: any[]
  unsafeFlags: any[]
  wallUnsafeFlags: any[]
  showsAds: boolean
}

export interface Data {
  id: string
  title?: any
  description: string
  datetime: number
  type: string
  animated: boolean
  width: number
  height: number
  size: number
  views: number
  bandwidth: number
  vote?: any
  favorite: boolean
  nsfw: boolean
  section: string
  account_url?: any
  account_id?: any
  is_ad: boolean
  in_most_viral: boolean
  has_sound: boolean
  tags: any[]
  ad_type: number
  ad_url: string
  edited: string
  in_gallery: boolean
  link: string
  mp4_size: number
  mp4: string
  gifv: string
  hls: string
  processing: Processing
  ad_config: AdConfig
}

export interface ImgurImageResponse {
  data: Data
  success: boolean
  status: number
}
