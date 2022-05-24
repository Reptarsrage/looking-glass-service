import axios from "axios";

const httpService = axios.create({
  baseURL: "https://app-api.pixiv.net/",
  headers: {
    "App-OS": "ios",
    "App-Version": "7.14.9",
    "App-OS-Version": "15.4.1",
    "app-accept-language": "en",
    "Accept-Language": "en-us",
    "X-Client-Hash": "db0aa4ab85cefa8d09b1eec558b19d8d",
    "User-Agent": "PixivIOSApp/7.14.9 (iOS 15.4.1; iPhone14,2)",
  },
  timeout: 5000,
});

export default httpService;
