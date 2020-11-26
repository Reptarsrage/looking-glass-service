import { AxiosInstance } from 'axios'
import { Logger } from 'src/logger'
import { PostData } from './redditResponse'
import ItemResponse from 'src/dto/itemResponse'

export type ResolveFunc = (post: PostData, httpService: AxiosInstance, logger: Logger) => Promise<ItemResponse>

export interface Host {
  domains: RegExp[]
  resolve: ResolveFunc
}
