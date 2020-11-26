import AuthType from 'src/dto/authType'
import Module from 'src/dto/moduleResponse'

const definition: Module = {
  id: 'pixiv',
  name: 'Pixiv',
  description: 'Pixiv is a Japanese online community for artists.',
  authType: AuthType.Basic,
  icon: `/pixiv_icon.png`,
  supportsAuthorFilter: false,
  supportsItemFilters: false,
  supportsSourceFilter: false,
  sort: [
    {
      id: 'following',
      name: 'Following',
      isDefault: true,
    },
    {
      id: 'recommended',
      name: 'Recommended ',
    },
    {
      id: 'recommended-illust',
      parentId: 'recommended',
      name: 'Illustrations',
    },
    {
      id: 'recommended-manga',
      parentId: 'recommended',
      name: 'Manga',
    },
  ],
  filters: [
    {
      id: 'tag',
      name: 'Tags',
      description: 'Filter by tagged content',
    },
  ],
}

export default definition
