import ItemResponse from './itemResponse'

export default interface PageResponse {
  items: ItemResponse[]
  hasNext: boolean
  offset: number
  after: string
}
