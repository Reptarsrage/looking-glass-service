import GfycatHost from '../gfycat'

describe('GfycatHost', () => {
  let gfycatHost: GfycatHost
  let httpService: any
  let logger: any
  let expectedData: any
  let expectedGfycatData: any

  beforeEach(() => {
    gfycatHost = new GfycatHost()
    logger = {
      debug: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      verbose: jest.fn(),
      error: jest.fn(),
    }

    httpService = {
      get: jest.fn(),
    }

    expectedData = {
      name: 'EXPECTED ID',
      title: 'EXPECTED TITLE',
      author: 'EXPECTED AUTHOR',
      subreddit: 'EXPECTED SUBREDDIT',
      subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
      created_utc: 1605459582.0,
      url: 'https://gfycat.com/defensiveimpartialhorseshoecrab',
    }

    expectedGfycatData = {
      gfyItem: {
        width: 1000,
        height: 1000,
        posterUrl: 'EXPECTED POSTER',
        content_urls: {
          mp4: {
            width: 0,
            height: 0,
            url: 'EXPECTED URL',
          },
        },
      },
    }
  })

  describe('domain', () => {
    it('matches gfycat domain', () => {
      expect(gfycatHost.domains.some((regex) => regex.test('gfycat.com'))).toEqual(true)
    })
  })

  describe('resolve', () => {
    it('returns null and logs on failure', async () => {
      httpService.get.mockImplementation(() => Promise.reject(new Error('TEST EXCEPTION')))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response).toBeNull()
      expect(logger.warn).toHaveBeenCalled()
    })

    it('resolves correct gfyId', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      await gfycatHost.resolve(expectedData, httpService, logger)
      expect(httpService.get).toHaveBeenCalledWith('https://api.gfycat.com/v1/gfycats/defensiveimpartialhorseshoecrab')
    })

    it('resolves title', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.title).toEqual(expectedData.title)
    })

    it('resolves id', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.id).toEqual(expectedData.name)
    })

    it('resolves date', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.date).toEqual(new Date(expectedData.created_utc * 1000).toISOString())
    })

    it('resolves author', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.author).toEqual({
        id: `u/${expectedData.author}`,
        filterSectionId: 'user',
        name: expectedData.author,
      })
    })

    it('resolves source', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.source).toEqual({
        id: expectedData.subreddit_name_prefixed,
        filterSectionId: 'subreddit',
        name: expectedData.subreddit,
      })
    })

    it('resolves isVideo', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.isVideo).toEqual(true)
    })

    it('resolves isGallery', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.isGallery).toEqual(false)
    })

    it('resolves filters', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.filters).toEqual([
        {
          id: expectedData.subreddit_name_prefixed,
          filterSectionId: 'subreddit',
          name: expectedData.subreddit,
        },
        {
          id: `u/${expectedData.author}`,
          filterSectionId: 'user',
          name: expectedData.author,
        },
      ])
    })

    it('resolves width', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.width).toEqual(expectedGfycatData.gfyItem.width)
    })

    it('resolves height', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.width).toEqual(expectedGfycatData.gfyItem.height)
    })

    it('resolves poster', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.poster).toEqual(expectedGfycatData.gfyItem.posterUrl)
    })

    it('resolves urls', async () => {
      httpService.get.mockImplementation(() => Promise.resolve({ data: expectedGfycatData }))
      const response = await gfycatHost.resolve(expectedData, httpService, logger)
      expect(response.urls).toEqual([expectedGfycatData.gfyItem.content_urls.mp4])
    })
  })
})
