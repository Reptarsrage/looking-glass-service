import { extname } from "path";
import { AxiosError, AxiosRequestConfig } from "axios";

import { ImgurImageResponse } from "../../reddit/dto/imgurImageResponse";
import { PostData } from "../../reddit/dto/redditResponse";
import ItemResponse from "../../dto/itemResponse";
import { HostBase } from "../../reddit/dto/redditHost";

export default class ImgurHost extends HostBase {
  static domains: RegExp[] = [/imgur\.com/i];

  parsePost = async (data: PostData): Promise<ItemResponse | null> => {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url, selftext } = data;
    const date = new Date(created_utc * 1000).toISOString();

    // url could be one of
    //  image: /<ID>.<EXT>
    //  gallery: /gallery/<ID>
    //  album: /a/<ID>

    const type = url
      .split("?")[0] // remove query string
      .split("/") // split by path
      .slice(-2)[0]; // take second to last path part

    const imgurId = url
      .split("?")[0] // remove query string
      .split("/") // split by path
      .slice(-1)[0] // take last path part
      .split(".")[0]; // remove extension

    // TODO: Support Imgur albums
    // see: https://apidocs.imgur.com/#5369b915-ad8b-47b1-b44b-8e2561e41cee
    if (type === "a") {
      this.logger.warn(`Imgur albums not currently supported: ${url}`);
      return null;
    }

    // TODO: Support Imgur galleries
    // see: https://apidocs.imgur.com/#eff60e84-5781-4c12-926a-208dc4c7cc94
    if (type === "gallery") {
      this.logger.warn(`Imgur galleries not currently supported: ${url}`);
      return null;
    }

    // hit up imgur API
    // see https://apidocs.imgur.com/#2078c7e0-c2b8-4bc8-a646-6e544b087d0f
    const imgurApiUrl = `https://api.imgur.com/3/image/${imgurId}`;
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
    };

    try {
      const response = await this.httpService.get<ImgurImageResponse>(imgurApiUrl, axiosConfig);

      // sanity check
      if (response.status !== 200 || !response.data.success || response.data.status !== 200) {
        this.logger.error(response.data || {}, "Error communicating with Imgur API");
        return null;
      }

      // parse response
      const { type, width, height, link, description } = response.data.data;
      const isVideo = type.startsWith("video"); // mime type
      const ext = extname(link);
      const poster = isVideo ? link.replace(ext, ".jpg") : undefined;
      const urls = [{ url: link, width, height }];

      return {
        id: name,
        name: title,
        description: selftext || description,
        date,
        author: {
          id: `user/${author}`,
          filterSectionId: "user",
          name: author,
        },
        source: {
          id: subreddit_name_prefixed,
          filterSectionId: "subreddit",
          name: subreddit,
        },
        width,
        height,
        urls,
        poster,
        isVideo,
        isGallery: false,
        filters: [
          {
            id: subreddit_name_prefixed,
            filterSectionId: "subreddit",
            name: subreddit,
          },
          {
            id: `user/${author}`,
            filterSectionId: "user",
            name: author,
          },
        ],
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        this.logger.error(error.response?.data ?? error.status, "Error communicating with Imgur API");
      } else {
        this.logger.error(error, "Error communicating with Imgur API");
      }

      return null;
    }
  };
}
