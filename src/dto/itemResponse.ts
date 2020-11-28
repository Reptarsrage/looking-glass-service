import AuthorResponse from './authorResponse'
import FilterResponse from './filterResponse'
import MediaResponse from './mediaResponse'
import SourceResponse from './sourceResponse'

export default interface ItemResponse {
  id: string
  name: string
  width: number
  height: number
  isVideo: boolean
  isGallery: boolean
  urls: MediaResponse[]
  filters: FilterResponse[]
  poster?: string
  author?: AuthorResponse
  date?: string
  source?: SourceResponse
}
