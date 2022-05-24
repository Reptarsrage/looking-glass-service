export interface RedGifsResponse {
  gif: Gif;
  user: User;
}

export interface Gif {
  id: string;
  createDate: number;
  hasAudio: boolean;
  width: number;
  height: number;
  likes: number;
  tags: string[];
  verified: boolean;
  views: number;
  duration: number;
  published: boolean;
  type: number;
  urls: Urls;
  userName: string;
  avgColor: string;
  gallery?: string;
}

export interface Urls {
  sd: string;
  hd: string;
  gif: string;
  poster: string;
  thumbnail: string;
  vthumbnail: string;
}

export interface User {
  creationtime: number;
  followers: number;
  following: number;
  gifs: number;
  name: string;
  profileImageUrl: string;
  profileUrl: string;
  publishedGifs: number;
  subscription: number;
  url: string;
  username: string;
  verified: boolean;
  views: number;
}
