export default interface SortResponse {
  id: string
  parentId?: string
  name: string
  isDefault?: boolean
  availableInSearch?: boolean
  exclusiveToSearch?: boolean
}
