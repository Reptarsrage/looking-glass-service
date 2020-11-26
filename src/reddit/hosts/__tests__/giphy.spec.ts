import GiphyHost from '../giphy'

describe('ImgurHost', () => {
  let giphyHost: GiphyHost
  let httpService: any
  let logger: any
  let expectedData: any
  let expectedGihpyData: any

  beforeEach(() => {
    giphyHost = new GiphyHost()
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

    expectedGihpyData = {}
  })

  describe('domain', () => {
    it('matches giphy domain', () => {
      expect(giphyHost.domains.some((regex) => regex.test('giphy.com'))).toEqual(true)
    })
  })
})
