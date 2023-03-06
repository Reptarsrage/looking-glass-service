import { S } from "fluent-json-schema";

export default interface PageRequest {
  galleryId?: string;
  query?: string;
  offset?: number;
  after?: string;
  sort?: string;
  filters?: string | string[];
}

export const PageRequestSchema = S.object()
  .id("PageRequest")
  .title("PageRequest")
  .description("Page Request")
  .prop("galleryId", S.string())
  .prop("offset", S.number())
  .prop("query", S.string())
  .prop("after", S.string())
  .prop("sort", S.string())
  .prop("filters", S.array().items(S.string()));
