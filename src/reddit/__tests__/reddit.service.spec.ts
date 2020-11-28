import { AxiosInstance } from 'axios'

import * as redditService from '../reddit.service'
import axios from '../reddit.http'
import hosts from '../hosts'
import RedditHost from '../hosts/reddit'
import ItemResponse from 'src/dto/itemResponse'

jest.mock('pino')
jest.mock('../hosts')
jest.mock('../../config')
jest.mock('../../logger')
jest.mock('../reddit.http', () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
  }
})

describe('reddit.service', () => {
  let mockAxios: jest.Mocked<AxiosInstance>
  let mockHosts: jest.Mocked<RedditHost>

  beforeEach(() => {
    mockAxios = (axios as unknown) as jest.Mocked<AxiosInstance>
    mockHosts = (hosts as unknown) as jest.Mocked<RedditHost>
  })

  describe('authorize', () => {
    it('should call expected', async () => {
      // arrange
      const code = 'EXPECTED CODE'
      const expected = {
        access_token: 'ACCESS TOKEN',
        refresh_token: 'REFRESH TOKEN',
        token_type: 'TOKEN TYPE',
        scope: 'SCOPE',
        expires_in: 123,
      }

      mockAxios.post.mockImplementation(() => Promise.resolve({ data: expected }))

      // act
      const response = await redditService.authorize(code)

      // assert
      expect(response.accessToken).toEqual(expected.access_token)
      expect(response.refreshToken).toEqual(expected.refresh_token)
      expect(response.tokenType).toEqual(expected.token_type)
      expect(response.scope).toEqual(expected.scope)
      expect(response.expiresIn).toEqual(expected.expires_in)
    })
  })

  describe('refresh', () => {
    it('should call expected', async () => {
      // arrange
      const refreshToken = 'EXPECTED REFRESH TOKEN'
      const expected = {
        access_token: 'ACCESS TOKEN',
        token_type: 'TOKEN TYPE',
        scope: 'SCOPE',
        expires_in: 123,
      }

      mockAxios.post.mockImplementation(() => Promise.resolve({ data: expected }))

      // act
      const response = await redditService.refresh(refreshToken)

      // assert
      expect(response.accessToken).toEqual(expected.access_token)
      expect(response.refreshToken).toEqual(refreshToken)
      expect(response.tokenType).toEqual(expected.token_type)
      expect(response.scope).toEqual(expected.scope)
      expect(response.expiresIn).toEqual(expected.expires_in)
    })
  })

  describe('getSearch', () => {
    it('should call expected', async () => {
      // arrange
      const accessToken = 'EXPECTED ACCESS TOKEN'
      const count = 0
      const after = 'EXPECTED after'
      const query = 'EXPECTED query'
      const sort = 'EXPECTED sort'
      const filters = ['EXPECTED FILTER']
      const listing = {
        kind: 'Listing',
        data: {
          children: [
            {
              kind: 't3',
              data: 'TEST',
            },
          ],
          after: 'EXPECTED AFTER',
        },
      }

      const itemResponse: ItemResponse = {
        id: 'EXPECTED ID',
        name: 'EXPECTED TITLE',
        width: 1,
        height: 2,
        isVideo: false,
        isGallery: false,
        urls: [],
        filters: [],
      }

      mockAxios.get.mockImplementation(() => Promise.resolve({ data: listing }))
      mockHosts.resolve.mockImplementation(() => Promise.resolve(itemResponse))

      // act
      const response = await redditService.getSearch(accessToken, count, after, query, sort, filters)

      // assert
      expect(response).toEqual({
        after: 'EXPECTED AFTER',
        hasNext: true,
        items: [
          {
            filters: [],
            height: 2,
            id: 'EXPECTED ID',
            isGallery: false,
            isVideo: false,
            name: 'EXPECTED TITLE',
            urls: [],
            width: 1,
          },
        ],
        offset: 1,
      })
    })
  })
})
