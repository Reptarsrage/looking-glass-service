import axios from "axios";

export default axios.create({
  baseURL: "https://oauth.reddit.com",
  timeout: 5000,
  headers: {
    "User-Agent": process.env.REDDIT_USER_AGENT ?? "",
  },
});
