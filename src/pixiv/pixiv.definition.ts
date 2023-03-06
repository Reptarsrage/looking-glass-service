import AuthType from "../dto/authType.js";
import Module from "../dto/moduleResponse.js";
import challenge from "./pixiv.verifier.js";

const oAuthParams = new URLSearchParams([
  ["code_challenge_method", "S256"],
  ["code_challenge", challenge.codeChallenge],
  ["client", "pixiv-ios"],
]);

const definition: Module = {
  id: "pixiv",
  name: "Pixiv",
  description: "Pixiv is a Japanese online community for artists.",
  authType: AuthType.OAuth,
  oAuthUrl: `https://app-api.pixiv.net/web/v1/login?${oAuthParams.toString()}`,
  icon: `/pixiv_icon.png`,
  supportsAuthorFilter: false,
  supportsItemFilters: false,
  supportsSourceFilter: false,
  sort: [
    {
      id: "following",
      name: "Following",
      isDefault: true,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
    {
      id: "recommended",
      name: "Recommended ",
      isDefault: false,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
    {
      id: "recommended-illust",
      parentId: "recommended",
      name: "Illustrations",
      isDefault: false,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
    {
      id: "recommended-manga",
      parentId: "recommended",
      name: "Manga",
      isDefault: false,
      availableInSearch: false,
      exclusiveToSearch: false,
    },
  ],
  filters: [
    {
      id: "tag",
      name: "Tags",
      description: "Filter by tagged content",
      supportsMultiple: true,
      supportsSearch: true,
    },
    {
      id: "user",
      name: "User",
      description: "Added by user",
      supportsMultiple: true,
      supportsSearch: true,
    },
  ],
};

export default definition;
