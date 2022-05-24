import { AxiosError, AxiosInstance } from "axios";
import type { FastifyLoggerInstance } from "fastify";

import { PostData } from "../../reddit/dto/redditResponse";
import { GfyResponse } from "../../reddit/dto/gifycatResponse";
import ItemResponse from "../../dto/itemResponse";
import { Host } from "../../reddit/dto/redditHost";
import { truthy } from "../../utils";

export default class GfycatHost implements Host {
  domains = [/gfycat\.com/i];

  async resolve(
    data: PostData,
    httpService: AxiosInstance,
    logger: FastifyLoggerInstance
  ): Promise<ItemResponse | null> {
    const { name, title, author, subreddit, subreddit_name_prefixed, created_utc, url, selftext } = data;
    const date = new Date(created_utc * 1000).toISOString();

    const gfyId = url
      .split("?")[0] // get rid of query string
      .split("/") // split on path
      .slice(-1)[0]; // get last part of path

    try {
      // hit up the Gfycat API
      // see https://developers.gfycat.com/api/#getting-gfycats
      const response = await httpService.get<GfyResponse>(`https://api.gfycat.com/v1/gfycats/${gfyId}`);

      // sanity check
      if (response.status !== 200 || !response.data.gfyItem) {
        logger.error(response.data || {}, "Error communicating with Gfycat API");
        return null;
      }

      // parse response
      const { gfyItem } = response.data;
      const { width, height, posterUrl, mobilePosterUrl, miniPosterUrl, thumb100PosterUrl, content_urls, description } =
        gfyItem;
      const poster = posterUrl || mobilePosterUrl || miniPosterUrl || thumb100PosterUrl;
      const { mp4, mobile, webm, webp } = content_urls;
      const urls = [mp4, mobile, webm, webp].filter(truthy);

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
        logger.error(error.response?.data ?? error.status, "Error communicating with Gfycat API");
      } else {
        logger.error(error, "Error communicating with Gfycat API");
      }

      return null;
    }
  }
}
