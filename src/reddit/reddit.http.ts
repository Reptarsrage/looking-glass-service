import axios from 'axios'

import config from 'src/config'

export default axios.create({
  baseURL: 'https://oauth.reddit.com',
  timeout: 5000,
  headers: {
    'User-Agent': config.get('REDDIT_USER_AGENT'),
  },
})
