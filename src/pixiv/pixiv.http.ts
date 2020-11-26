import axios from 'axios'

const baseURL = 'https://app-api.pixiv.net/'
const appVersion = '7.9.7'
const userAgent = `PixiviOSApp/${appVersion} (iOS 14.1)`

const httpService = axios.create({
  baseURL,
  headers: {
    'App-OS': 'ios',
    'App-OS-Version': '7.9.5',
    'Accept-Language': 'en-us',
    'App-Version': appVersion,
    'User-Agent': userAgent,
  },
  timeout: 5000,
})

export default httpService
