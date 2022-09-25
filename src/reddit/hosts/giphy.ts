import { AxiosInstance, AxiosError } from "axios";
import type { FastifyBaseLogger } from "fastify";

import type { GiphyResponse } from "../../reddit/dto/giphyResponse";
import type { PostData } from "../../reddit/dto/redditResponse";
import type ItemResponse from "../../dto/itemResponse";
import type { Host } from "../../reddit/dto/redditHost";

export default class GiphyHost implements Host {
  domains: RegExp[] = [/giphy\.com/i];

  async resolve(post: PostData, httpService: AxiosInstance, logger: FastifyBaseLogger): Promise<ItemResponse | null> {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url, selftext } = post;
    const date = new Date(created_utc * 1000).toISOString();

    const gihpyId = url
      .split("?")[0] // remove query string
      .split("/") // split on paths
      .slice(-1)[0] // get last path part
      .split("-") // split giphy id
      .slice(-1)[0]; // take the last id part

    try {
      // hit up the Giphy API
      // see https://developers.giphy.com/docs/api/endpoint#get-gif-by-id
      const params = new URLSearchParams();
      params.set("api_key", process.env.GIPHY_API_KEY ?? "");

      const apiUrl = `https://api.giphy.com/v1/gifs/${gihpyId}?${params.toString()}`;
      const response = await httpService.get<GiphyResponse>(apiUrl);

      // sanity check
      if (response.status !== 200 || response.data.meta.status !== 200) {
        logger.error(response.data || {}, "Error communicating with GIPHY API");
        return null;
      }

      // parse response
      const { images } = response.data.data;
      const stills = Object.keys(images)
        .filter((key) => key.endsWith("_still"))
        .map((key) => images[key]);

      const mp4s = Object.values(images).filter(({ mp4 }) => Boolean(mp4));

      // sanity check
      if (stills.length === 0 || mp4s.length === 0) {
        logger.error(response.data, "GIPHY API contained no content");
        return null;
      }

      stills.sort((a, b) => parseInt(a.size, 10) - parseInt(b.size, 10));
      mp4s.sort((a, b) => parseInt(a.size, 10) - parseInt(b.size, 10));

      const poster = stills[0];
      const mp4 = mp4s[0];
      const { width, height } = mp4;

      // TODO: GIPHY urls require some transformation
      // for example given: https://media4.giphy.com/media/rIaxxamewrBiE/giphy_s.gif?cid=e1bb72ffe930515271c174e23d58c24fcf09a65044d82fd2&rid=giphy_s.gif
      // we want to transform it into https://i.giphy.com/media/rIaxxamewrBiE/giphy_s.gif

      return {
        id: name,
        name: title,
        description: selftext,
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
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        urls: mp4s.map((m) => ({
          url: m.url,
          width: parseInt(m.width, 10),
          height: parseInt(m.height, 10),
        })),
        poster: poster.url,
        isVideo: true,
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
        logger.error(error.response?.data ?? error.status, "Error communicating with GIPHY API");
      } else {
        logger.error(error, "Error communicating with GIPHY API");
      }

      return null;
    }
  }
}
