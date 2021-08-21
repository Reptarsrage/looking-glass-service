import axios from 'axios'

const baseURL = 'https://app-api.pixiv.net/'
const appVersion = '5.0.234'
const userAgent = `PixivAndroidApp/${appVersion} (Android 11; Pixel 5)`
const httpService = axios.create({
  baseURL,
  headers: {
    'App-OS': 'Android',
    'App-OS-Version': '11',
    'Accept-Language': 'en-us',
    'App-Version': appVersion,
    'User-Agent': userAgent,
  },
  timeout: 5000,
})

export default httpService
