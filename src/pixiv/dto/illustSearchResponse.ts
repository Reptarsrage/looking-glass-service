export interface PixivUser {
  id: number
  name: string
  account: string
  profileImageUrls: {
    medium: string
  }
  comment: string
  isFollowed: boolean
}

export interface PixivTag {
  name: string
  translatedName: string | null
  addedByUploadedUser?: boolean
  illust?: PixivIllust
  isRegistered?: boolean
}

export interface PixivMetaPage {
  imageUrls: {
    squareMedium: string
    medium: string
    large: string
    original: string
  }
}

export interface PixivIllust {
  id: number
  title: string
  type: string
  imageUrls: {
    squareMedium: string
    medium: string
    original: string
    large?: string
  }
  caption: string
  restrict: number
  user: PixivUser
  tags: PixivTag[]
  tools: string[]
  createDate: string
  pageCount: number
  width: number
  height: number
  sanityLevel: number
  metaSinglePage: {
    originalImageUrl?: string
  }
  metaPages: PixivMetaPage[]
  totalView: number
  totalBookmarks: number
  isBookmarked: boolean
  visible: boolean
  isMuted: boolean
  totalComments: number
}

export interface PixivIllustSearch {
  illusts: PixivIllust[]
  nextUrl: string | null
  searchSpanLimit?: number
}

export interface PixivIllustDetail {
  illust: PixivIllust
}
