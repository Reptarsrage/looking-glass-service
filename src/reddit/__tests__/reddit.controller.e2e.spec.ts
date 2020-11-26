import { FastifyInstance } from 'fastify'
import { AxiosInstance } from 'axios'
import supertest from 'supertest'

import createServer from '../../server'
import axios from '../reddit.http'
import PageRequest from 'src/dto/pageRequest'

jest.mock('pino')
jest.mock('../../config')
jest.mock('../../logger')
jest.mock('../reddit.http', () => {
  return {
    get: jest.fn(),
  }
})

describe('RedditController (e2e)', () => {
  let app: FastifyInstance
  const mockAxios = (axios as unknown) as jest.Mocked<AxiosInstance>

  beforeEach(async () => {
    app = createServer()
    await app.ready()
  })

  afterEach(() => {
    app.close()
  })

  describe('/ (GET)', () => {
    it('returns successful response', (done) => {
      const redditListing = {
        kind: 'Listing',
        data: {
          children: [
            {
              kind: 't3',
              data: {
                domain: 'reddit.com',
                preview: {
                  reddit_video_preview: null,
                  enabled: true,
                  images: [
                    {
                      source: {
                        url: 'EXPECTED URL',
                        width: 1,
                        height: 2,
                      },
                      resolutions: [],
                      variants: null,
                    },
                  ],
                },
                name: 'EXPECTED ID',
                title: 'EXPECTED TITLE',
                author: 'EXPECTED AUTHOR',
                subreddit: 'EXPECTED SUBREDDIT',
                subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
                created_utc: 0,
                secure_media: null,
                media: null,
                thumbnail: null,
                thumbnail_height: null,
                thumbnail_width: null,
                url: 'EXPECTED URL',
              },
            },
          ],
          after: 'EXPECTED AFTER',
        },
      }

      const request: PageRequest = {
        galleryId: '',
        query: '',
        offset: 0,
        after: '',
        sort: '',
        filters: [],
      }

      mockAxios.get.mockImplementation(() => Promise.resolve({ data: redditListing }))

      supertest(app.server)
        .post('/reddit')
        .set('access-token', 'ACCESS TOKEN')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })

    it('returns valid body', (done) => {
      const redditListing = {
        kind: 'Listing',
        data: {
          children: [
            {
              kind: 't3',
              data: {
                domain: 'reddit.com',
                preview: {
                  reddit_video_preview: null,
                  enabled: true,
                  images: [
                    {
                      source: {
                        url: 'EXPECTED URL',
                        width: 1,
                        height: 2,
                      },
                      resolutions: [],
                      variants: null,
                    },
                  ],
                },
                name: 'EXPECTED ID',
                title: 'EXPECTED TITLE',
                author: 'EXPECTED AUTHOR',
                subreddit: 'EXPECTED SUBREDDIT',
                subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
                created_utc: 0,
                secure_media: null,
                media: null,
                thumbnail: null,
                thumbnail_height: null,
                thumbnail_width: null,
                url: 'EXPECTED URL',
              },
            },
          ],
          after: 'EXPECTED AFTER',
        },
      }

      const expected = {
        items: [
          {
            id: 'EXPECTED ID',
            title: 'EXPECTED TITLE',
            date: '1970-01-01T00:00:00.000Z',
            author: {
              id: 'u/EXPECTED AUTHOR',
              filterSectionId: 'user',
              name: 'EXPECTED AUTHOR',
            },
            source: {
              id: 'r/EXPECTED SUBREDDIT',
              filterSectionId: 'subreddit',
              name: 'EXPECTED SUBREDDIT',
            },
            width: 1,
            height: 2,
            urls: [
              {
                url: 'EXPECTED URL',
                width: 1,
                height: 2,
              },
            ],
            isVideo: false,
            isGallery: false,
            filters: [
              {
                id: 'r/EXPECTED SUBREDDIT',
                filterSectionId: 'subreddit',
                name: 'EXPECTED SUBREDDIT',
              },
              {
                id: 'u/EXPECTED AUTHOR',
                filterSectionId: 'user',
                name: 'EXPECTED AUTHOR',
              },
            ],
          },
        ],
        hasNext: true,
        offset: 1,
        after: 'EXPECTED AFTER',
      }

      const request: PageRequest = {
        galleryId: '',
        query: '',
        offset: 0,
        after: '',
        sort: '',
        filters: [],
      }

      mockAxios.get.mockImplementation(() => Promise.resolve({ data: redditListing }))

      supertest(app.server)
        .post('/reddit')
        .set('access-token', 'ACCESS TOKEN')
        .send(request)
        .expect((res) => {
          expect(res.body).toEqual(expected)
        })
        .end(done)
    })
  })
})
