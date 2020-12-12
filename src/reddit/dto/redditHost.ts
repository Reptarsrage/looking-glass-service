import { AxiosInstance } from 'axios'
import { Logger } from '../../logger'
import { PostData } from './redditResponse'
import ItemResponse from '../../dto/itemResponse'

export type ResolveFunc = (post: PostData, httpService: AxiosInstance, logger: Logger) => Promise<ItemResponse>

export interface Host {
  domains: RegExp[]
  resolve: ResolveFunc
}
