import ImgurHost from '../imgur'

describe('ImgurHost', () => {
  let imgurHost: ImgurHost
  let httpService: any
  let logger: any
  let expectedData: any
  let expectedImgurData: any

  beforeEach(() => {
    imgurHost = new ImgurHost()
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

    expectedImgurData = {}
  })

  describe('domain', () => {
    it('matches imgur domain', () => {
      expect(imgurHost.domains.some((regex) => regex.test('imgur.com'))).toEqual(true)
    })
  })
})
