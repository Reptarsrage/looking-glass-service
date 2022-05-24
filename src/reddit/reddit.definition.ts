import { nanoid } from "nanoid";

import AuthType from "../dto/authType";
import Sort from "../dto/sortResponse";
import Module from "../dto/moduleResponse";

const oAuthParams = new URLSearchParams();
oAuthParams.set("client_id", process.env.REDDIT_CLIENT_ID ?? "");
oAuthParams.set("redirect_uri", "http://localhost");
oAuthParams.set("response_type", "code");
oAuthParams.set("state", nanoid());
oAuthParams.set("duration", "permanent");
oAuthParams.set("scope", "read mysubreddits history");

const timeSeries: Sort[] = [
  {
    id: "hour",
    name: "Hour",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
  {
    id: "day",
    name: "Day",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
  {
    id: "week",
    name: "Week",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
  {
    id: "month",
    name: "Month",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
  {
    id: "year",
    name: "Year",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
  {
    id: "all",
    name: "All Time",
    isDefault: false,
    availableInSearch: false,
    exclusiveToSearch: false,
  },
];

const definition: Module = {
  id: "reddit",
  name: "Reddit",
  description: "Reddit is an American social news aggregation, web content rating, and discussion website.",
  authType: AuthType.OAuth,
  oAuthUrl: `https://www.reddit.com/api/v1/authorize.compact?${oAuthParams.toString()}`,
  icon: `/reddit_icon.png`,
  supportsItemFilters: true,
  supportsAuthorFilter: true,
  supportsSourceFilter: true,
  filters: [
    {
      id: "multireddit",
      name: "Multireddits",
      description: "Custom feeds",
      supportsMultiple: false,
      supportsSearch: true,
    },
    {
      id: "subreddit",
      name: "Subreddits",
      description: "My communities",
      supportsMultiple: true,
      supportsSearch: true,
    },
    {
      id: "user",
      name: "Submitted By",
      description: "See other posts submitted by this user",
      supportsMultiple: false,
      supportsSearch: false,
    },
  ],
  sort: [
    {
      id: "hot",
      name: "Hot",
      isDefault: true,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
    {
      id: "best",
      name: "Best",
      isDefault: false,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
    {
      id: "top",
      name: "Top",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },

    ...timeSeries.map((t) => ({
      ...t,
      id: `top-${t.id}`,
      parentId: "top",
      availableInSearch: true,
    })),
    {
      id: "new",
      name: "New",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `new-${t.id}`,
      parentId: "new",
      exclusiveToSearch: true,
      availableInSearch: true,
    })),

    {
      id: "rising",
      name: "Rising",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "controversial",
      name: "Controversial",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `controversial-${t.id}`,
      parentId: "controversial",
    })),
    {
      id: "relevance",
      name: "Relevance",
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `relevance-${t.id}`,
      parentId: "relevance",
      exclusiveToSearch: true,
      availableInSearch: true,
    })),
    {
      id: "comments",
      name: "Total Comments",
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `comments-${t.id}`,
      parentId: "comments",
      exclusiveToSearch: true,
      availableInSearch: true,
    })),
  ],
};

export default definition;
