import { S } from "fluent-json-schema";

import { ItemResponseSchema } from "./itemResponse.js";
import type ItemResponse from "./itemResponse.js";

export default interface PageResponse {
  items: ItemResponse[];
  hasNext: boolean;
  offset: number;
  after?: string;
}

export const PageResponseSchema = S.object()
  .id("PageResponse")
  .title("PageResponse")
  .description("Page Response")
  .prop("items", S.array().items(ItemResponseSchema).required())
  .prop("offset", S.number().required())
  .prop("hasNext", S.boolean().required())
  .prop("after", S.string());
