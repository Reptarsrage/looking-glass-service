import AuthType from './authType'
import FilterSectionResponse from './filterSectionResponse'
import SortResponse from './sortResponse'

export default interface ModuleResponse {
  id: string
  name: string
  description: string
  authType: AuthType
  oAuthUrl?: string
  icon: string
  filters: FilterSectionResponse[]
  sort: SortResponse[]
  supportsItemFilters: boolean
  supportsAuthorFilter: boolean
  supportsSourceFilter: boolean
}
