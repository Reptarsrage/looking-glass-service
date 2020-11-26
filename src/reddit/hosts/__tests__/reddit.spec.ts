import RedditHost from '../reddit'

describe('RedditHost', () => {
  let redditHost: RedditHost
  let logger: any
  let expectedImageData: any
  let expectedVideoData: any

  beforeEach(() => {
    redditHost = new RedditHost()
    logger = {
      debug: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      verbose: jest.fn(),
      error: jest.fn(),
    }

    expectedImageData = {
      is_video: false,
      preview: {
        images: [
          {
            source: {
              url: 'EXPECTED SOURCE URL',
              width: 640,
              height: 352,
            },
            resolutions: [
              {
                url: 'EXPECTED BACKUP URL',
                width: 320,
                height: 176,
              },
              {
                url: 'EXPECTED SOURCE URL',
                width: 640,
                height: 352,
              },
            ],
          },
        ],
        enabled: false,
      },
      name: 'EXPECTED ID',
      title: 'EXPECTED TITLE',
      author: 'EXPECTED AUTHOR',
      subreddit: 'EXPECTED SUBREDDIT',
      subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
      created_utc: 1605459582.0,
      secure_media: null,
      media: null,
    }

    expectedVideoData = {
      is_video: true,
      preview: {
        images: [
          {
            source: {
              url: 'EXPECTED SOURCE URL',
              width: 640,
              height: 352,
            },
            resolutions: [
              {
                url: 'EXPECTED BACKUP URL',
                width: 320,
                height: 176,
              },
              {
                url: 'EXPECTED SOURCE URL',
                width: 640,
                height: 352,
              },
            ],
          },
        ],
        enabled: false,
      },
      name: 'EXPECTED ID',
      title: 'EXPECTED TITLE',
      author: 'EXPECTED AUTHOR',
      subreddit: 'EXPECTED SUBREDDIT',
      subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
      created_utc: 1605459582.0,
      secure_media: {
        reddit_video: {
          width: 640,
          height: 352,
          fallback_url: 'EXPECTED URL',
          scrubber_media_url: 'EXPECTED sECOND URL',
        },
      },
      media: null,
    }
  })

  // describe('domain', () => {
  //   it('matches image domain', () => {
  //     expect(redditHost.domains.some((regex) => regex.test('i.redd.it'))).toEqual(true)
  //   })

  //   it('matches video domain', () => {
  //     expect(redditHost.domains.some((regex) => regex.test('v.redd.it'))).toEqual(true)
  //   })
  // })

  describe('resolve', () => {
    describe('when given image post', () => {
      it('resolves image post title', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.title).toEqual(expectedImageData.title)
      })

      it('resolves image post id', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.id).toEqual(expectedImageData.name)
      })

      it('resolves image post date', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.date).toEqual(new Date(expectedImageData.created_utc * 1000).toISOString())
      })

      it('resolves image post author', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.author).toEqual({
          id: `u/${expectedImageData.author}`,
          filterSectionId: 'user',
          name: expectedImageData.author,
        })
      })

      it('resolves image post source', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.source).toEqual({
          id: expectedImageData.subreddit_name_prefixed,
          filterSectionId: 'subreddit',
          name: expectedImageData.subreddit,
        })
      })

      it('resolves image post width', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.width).toEqual(640)
      })

      it('resolves image post height', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.height).toEqual(352)
      })

      it('resolves image post isVideo', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.isVideo).toEqual(false)
      })

      it('resolves image post isGallery', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.isGallery).toEqual(false)
      })

      it('resolves image post filters', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.filters).toEqual([
          {
            id: expectedImageData.subreddit_name_prefixed,
            filterSectionId: 'subreddit',
            name: expectedImageData.subreddit,
          },
          {
            id: `u/${expectedImageData.author}`,
            filterSectionId: 'user',
            name: expectedImageData.author,
          },
        ])
      })

      it('resolves image post urls', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.urls).toEqual(expectedImageData.preview.images[0].resolutions)
      })

      it('resolves image post poster', async () => {
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.poster).toBeUndefined()
      })

      it('uses fallback url and sizes', async () => {
        expectedImageData.preview.images[0].source = null
        const response = await redditHost.resolve(expectedImageData, null, logger)
        expect(response.urls).toEqual(expectedImageData.preview.images[0].resolutions)
        expect(response.width).toEqual(expectedImageData.preview.images[0].resolutions[1].width)
        expect(response.height).toEqual(expectedImageData.preview.images[0].resolutions[1].height)
      })
    })

    describe('when given video post', () => {
      it('resolves video post title', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.title).toEqual(expectedVideoData.title)
      })

      it('resolves video post id', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.id).toEqual(expectedVideoData.name)
      })

      it('resolves video post date', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.date).toEqual(new Date(expectedVideoData.created_utc * 1000).toISOString())
      })

      it('resolves video post author', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.author).toEqual({
          id: `u/${expectedVideoData.author}`,
          filterSectionId: 'user',
          name: expectedVideoData.author,
        })
      })

      it('resolves video post source', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.source).toEqual({
          id: expectedVideoData.subreddit_name_prefixed,
          filterSectionId: 'subreddit',
          name: expectedVideoData.subreddit,
        })
      })

      it('resolves video post width', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.width).toEqual(640)
      })

      it('resolves video post height', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.height).toEqual(352)
      })

      it('resolves video post isVideo', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.isVideo).toEqual(true)
      })

      it('resolves video post isGallery', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.isGallery).toEqual(false)
      })

      it('resolves video post filters', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.filters).toEqual([
          {
            id: expectedVideoData.subreddit_name_prefixed,
            filterSectionId: 'subreddit',
            name: expectedVideoData.subreddit,
          },
          {
            id: `u/${expectedVideoData.author}`,
            filterSectionId: 'user',
            name: expectedVideoData.author,
          },
        ])
      })

      it('resolves video post urls', async () => {
        const { reddit_video } = expectedVideoData.secure_media

        const response = await redditHost.resolve(expectedVideoData, null, logger)

        expect(response.urls).toEqual([
          { url: reddit_video.fallback_url, width: reddit_video.width, height: reddit_video.height },
          { url: reddit_video.scrubber_media_url, width: 0, height: 0 },
        ])
      })

      it('resolves video post poster', async () => {
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.poster).toEqual(expectedVideoData.preview.images[0].source.url)
      })

      it('ignores missing video post poster', async () => {
        expectedVideoData.preview = null
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.poster).toBeNull()
      })

      it('poster uses fallback', async () => {
        expectedVideoData.preview.images[0].source = null
        const response = await redditHost.resolve(expectedVideoData, null, logger)
        expect(response.poster).toEqual(expectedVideoData.preview.images[0].resolutions[1].url)
      })
    })

    it('when given a bad image post', async () => {
      const badData: any = {
        is_video: false,
        preview: null,
        secure_media: null,
        media: null,
        name: 'EXPECTED ID',
        title: 'EXPECTED TITLE',
        author: 'EXPECTED AUTHOR',
        subreddit: 'EXPECTED SUBREDDIT',
        subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
        created_utc: 1605459582.0,
      }

      const response = await redditHost.resolve(badData, null, logger)
      expect(response).toBeNull()
      expect(logger.warn).toHaveBeenCalled()
    })

    it('when given a bad video post', async () => {
      const badData: any = {
        is_video: true,
        preview: null,
        secure_media: null,
        media: null,
        name: 'EXPECTED ID',
        title: 'EXPECTED TITLE',
        author: 'EXPECTED AUTHOR',
        subreddit: 'EXPECTED SUBREDDIT',
        subreddit_name_prefixed: 'r/EXPECTED SUBREDDIT',
        created_utc: 1605459582.0,
      }

      const response = await redditHost.resolve(badData, null, logger)
      expect(response).toBeNull()
      expect(logger.warn).toHaveBeenCalled()
    })
  })
})
