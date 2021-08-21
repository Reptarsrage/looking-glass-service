import { stringify } from 'qs'

import AuthType from '../dto/authType'
import Module from '../dto/moduleResponse'
import challenge from './pixiv.verifier'

const oAuthParams: any = {
  code_challenge: challenge.codeChallenge,
  code_challenge_method: 'S256',
  client: 'pixiv-android',
}

const definition: Module = {
  id: 'pixiv',
  name: 'Pixiv',
  description: 'Pixiv is a Japanese online community for artists.',
  authType: AuthType.OAuth,
  oAuthUrl: `https://app-api.pixiv.net/web/v1/login?${stringify(oAuthParams)}`,
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
      supportsMultiple: true,
      supportsSearch: true,
    },
  ],
}

export default definition
