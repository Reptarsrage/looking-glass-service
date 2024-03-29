import type { AxiosRequestConfig } from "axios";
import type { FastifyBaseLogger, FastifyRequest } from "fastify";

import { nonNullable } from "../utils.js";
import type PageResponse from "../dto/pageResponse.js";
import type AuthResponse from "../dto/authResponse.js";
import type FilterResponse from "../dto/filterResponse.js";
import type ItemResponse from "../dto/itemResponse.js";

import httpService from "./reddit.http.js";
import HostFactory from "./hosts/hostFactory.js";
import type { AuthToken, Listing, MultiReddit, Post, Subreddit } from "./dto/redditResponse.js";

class RedditService {
  logger: FastifyBaseLogger;
  hostname: string;
  req: FastifyRequest;

  constructor(req: FastifyRequest) {
    this.logger = req.log;
    this.hostname = req.hostname;
    this.req = req;
  }

  authorize = async (code: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.set("code", code);
    params.set("grant_type", "authorization_code");
    params.set("redirect_uri", "http://localhost");

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.REDDIT_CLIENT_ID ?? "",
        password: "",
      },
    };

    const { data } = await httpService.post<AuthToken>(
      "https://www.reddit.com/api/v1/access_token",
      params,
      axiosConfig
    );

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
      tokenType: data.token_type,
    };
  };

  refresh = async (refreshToken: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.set("grant_type", "refresh_token");
    params.set("refresh_token", refreshToken);

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.REDDIT_CLIENT_ID ?? "",
        password: "",
      },
    };

    const { data } = await httpService.post<AuthToken>(
      "https://www.reddit.com/api/v1/access_token",
      params,
      axiosConfig
    );

    return {
      accessToken: data.access_token,
      refreshToken,
      expiresIn: data.expires_in,
      scope: data.scope,
      tokenType: data.token_type,
    };
  };

  // https://www.reddit.com/dev/api/#GET_search
  getSearch = async (
    accessToken: string,
    count: number,
    after: string,
    query: string,
    sort: string,
    filters: string[]
  ): Promise<PageResponse> => {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    let path = "search";
    const params = new URLSearchParams();
    params.set("after", after);
    params.set("count", count.toString());
    params.set("q", query);
    params.set("limit", "25");
    params.set("sort", "relevance");
    params.set("t", "all");
    params.set("restrict_sr", filters.length > 0 ? "true" : "false");
    params.set("raw_json", "1"); // remove body html encoding

    // parse sort
    if (sort) {
      const [sortValue, t] = sort.split("-");
      if (t) {
        params.set("t", t);
      }

      params.set("sort", sortValue);
    }

    // check if we need to access a user's submitted page
    let filterDuplicates = false;
    if (filters.some((filter) => filter.startsWith("user/"))) {
      const user = filters.find((filter) => filter.startsWith("user/"));
      path = `${user}/submitted/${path}`;
      params.set("type", "links");
      filterDuplicates = true;
    } else {
      // parse filters
      path = this.combineFiltersWithPath(filters, path);
    }

    const url = `/${path}?${params.toString()}`;
    const { data } = await httpService.get<Listing>(url, axiosConfig);
    const listing = await this.parseRedditListing(data, count);
    if (filterDuplicates) {
      listing.items = listing.items.filter((x, i, a) => a.findIndex((y) => y.urls[0].url === x.urls[0].url) === i);
    }

    return listing;
  };

  // https://www.reddit.com/dev/api/#GET_best
  getListing = async (
    accessToken: string,
    count: number,
    after: string,
    sort: string,
    filters: string[]
  ): Promise<PageResponse> => {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // build params
    const params = new URLSearchParams();
    params.set("after", after);
    params.set("count", count.toString());
    params.set("raw_json", "1"); // remove body html encoding

    // parse sort
    let path = "hot";
    if (sort) {
      const [sortValue, t] = sort.split("-");
      if (t) {
        params.set("t", t);
      }

      path = sortValue;
    }

    // check if we need to access a user's submitted page
    let filterDuplicates = false;
    if (filters.some((filter) => filter.startsWith("user/"))) {
      const user = filters.find((filter) => filter.startsWith("user/"));
      path = `${user}/submitted/${path}`;
      params.set("type", "links");
      filterDuplicates = true;
    } else {
      // parse filters
      path = this.combineFiltersWithPath(filters, path);
    }

    const url = `/${path}?${params.toString()}`;
    const { data } = await httpService.get<Listing>(url, axiosConfig);
    const listing = await this.parseRedditListing(data, count);
    if (filterDuplicates) {
      listing.items = listing.items.filter((x, i, a) => a.findIndex((y) => y.urls[0].url === x.urls[0].url) === i);
    }

    return listing;
  };

  filters = async (accessToken: string, filter: string): Promise<FilterResponse[]> => {
    switch (filter) {
      case "subreddit":
        return this.getSubreddits(accessToken);
      case "multireddit":
        return this.getMultireddits(accessToken);
      case "user":
        return [];
      default:
        this.logger.error(`Unknown reddit filter: ${filter}`);
        throw new Error("Unknown filter");
    }
  };

  filtersForItem = async (accessToken: string, itemId: string): Promise<FilterResponse[]> => {
    const article = itemId.replace(/^t[0-9]+_/, "");
    const path = `duplicates/${article}`;
    const params = new URLSearchParams();
    params.set("crossposts_only", "true");
    params.set("limit", "100");
    params.set("raw_json", "1");
    params.set("show", "all");
    params.set("sort", "new");
    params.set("sr_detail", "true");

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `/${path}?${params.toString()}`;
    const { data: listings } = await httpService.get<Listing[]>(url, axiosConfig);

    return listings.reduce((accFilters, listing) => {
      const { data, kind } = listing;
      const { children } = data;

      const listingFilters = children.map((child): FilterResponse => {
        if (kind !== "Listing") {
          this.logger.warn(`Unknown reddit listing kind: ${kind}`);
          throw new Error(`Unable to parse Reddit response. Unknown listing kind ${kind}`);
        }

        if (child.kind !== "t3") {
          this.logger.warn(`Unknown reddit child kind: ${child.kind}`);
          throw new Error(`Unable to parse Reddit response. Unknown child kind ${child.kind}`);
        }

        return {
          id: child.data.subreddit_name_prefixed,
          name: child.data.subreddit,
          filterSectionId: child.data.subreddit_name_prefixed.startsWith("u/") ? "user" : "subreddit",
        };
      });

      return [...accFilters, ...listingFilters];
    }, [] as FilterResponse[]);
  };

  /** parses a listing type response form reddit */
  private parseRedditListing = async (listing: Listing, count: number): Promise<PageResponse> => {
    const { data, kind } = listing;
    if (kind !== "Listing") {
      this.logger.error(`Unknown reddit listing kind: ${kind}`);
      throw new Error("Unable to parse Reddit response");
    }

    const { children, after } = data;
    const tasks = children.map((post) => this.parseRedditPost(post));
    const items = await Promise.all(tasks);
    return {
      hasNext: Boolean(after),
      offset: children.length + count,
      after,
      items: items.filter(nonNullable),
    };
  };

  /** parses a post type response from reddit */
  private parseRedditPost = async (post: Post | Subreddit): Promise<ItemResponse | null> => {
    const { data, kind } = post;
    if (kind !== "t3") {
      this.logger.warn(`Unknown reddit post kind: ${kind}`);
      return null;
    }

    const { domain, url } = data;

    try {
      const host = new HostFactory(this.req, httpService).getHost(domain, url);
      return await host.parsePost(data);
    } catch (error: unknown) {
      this.logger.error(error, `Error parsing reddit post using ${domain} logic`);
    }

    return null;
  };

  private getSubreddits = async (accessToken: string): Promise<FilterResponse[]> => {
    const path = "subreddits/mine/subscriber";
    const params = new URLSearchParams();
    params.set("count", "0");
    params.set("limit", "100");
    params.set("raw_json", "1");
    params.set("show", "all");
    params.set("sr_detail", "true");

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    let thingsFetchedThisTime = 0;
    let counter = 0;
    let nextPage = "";
    let subs: FilterResponse[] = [];

    do {
      // get page
      const response = await httpService.get<Listing>(`/${path}?${params.toString()}`, axiosConfig);

      // parse response
      const listing = response.data;
      const { data, kind } = listing;
      const { after, children } = data;

      // sanity check
      if (kind !== "Listing") {
        // logger.warn(`Unknown reddit listing kind: ${kind}`)
        throw new Error(`Unable to parse Reddit response. Unknown listing kind ${kind}`);
      }

      // add subreddits to resulting array
      subs = [
        ...subs,
        ...children
          .filter((child) => child.kind === "t5")
          .map(
            (child) =>
              ({
                id: child.data.url,
                name: child.data.display_name,
                filterSectionId: "subreddit",
              } as FilterResponse)
          ),
      ];

      // check if there's a next page
      if (!after || children.length === 0) {
        break;
      }

      // set up for next page
      thingsFetchedThisTime = children.length;
      nextPage = after;
      counter += thingsFetchedThisTime;
      params.set("count", counter.toString());
      params.set("after", nextPage);
    } while (nextPage && thingsFetchedThisTime > 0);

    return subs;
  };

  private getMultireddits = async (accessToken: string): Promise<FilterResponse[]> => {
    const path = "api/multi/mine";
    const params = new URLSearchParams();
    params.set("raw_json", "1");
    params.set("expand_srs", "true");

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `/${path}?${params.toString()}`;
    const { data } = await httpService.get<MultiReddit[]>(url, axiosConfig);
    return data.map((multi): FilterResponse => {
      if (multi.kind !== "LabeledMulti") {
        // logger.warn(`Unknown reddit label kind: ${kind}`)
        throw new Error(`Unable to parse Reddit response. Unknown label kind ${multi.kind}`);
      }

      return {
        id: multi.data.path,
        name: multi.data.name,
        filterSectionId: "multireddit",
      };
    });
  };

  private combineFiltersWithPath = (filters: string[], path: string): string => {
    if (filters.length > 1) {
      const pathPart = filters
        .map((filter) =>
          filter
            .replace(/(^\/|\/$)/g, "")
            .replace(/^u\//i, "u_")
            .replace(/^r\//i, "")
        )
        .join("+");
      path = `r/${pathPart}/${path}`;
    } else if (filters.length === 1) {
      const pathPart = filters[0].replace(/(^\/|\/$)/g, "");
      path = `${pathPart}/${path}`;
    }

    return path;
  };
}

export default RedditService;
