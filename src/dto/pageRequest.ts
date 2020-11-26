export default interface PageRequest {
  galleryId: string
  query: string
  offset: number
  after: string
  sort: string
  filters: string[]
}
