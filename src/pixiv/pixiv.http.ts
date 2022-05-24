import axios from 'axios'

const httpService = axios.create({
  baseURL: 'https://app-api.pixiv.net/',
  headers: {
    'App-OS': 'ios',
    'App-Version': '7.14.8',
    'App-OS-Version': '15.4.1',
    'Accept-Language': 'en-us',
    'User-Agent': 'PixivIOSApp/7.14.8 (iOS 15.4.1; iPhone14,2)',
  },
  timeout: 5000,
})

export default httpService
