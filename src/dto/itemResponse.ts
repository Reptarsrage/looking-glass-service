import { S } from "fluent-json-schema";

import AuthorResponse, { AuthorResponseSchema } from "./authorResponse.js";
import FilterResponse, { FilterResponseSchema } from "./filterResponse.js";
import MediaResponse, { MediaResponseSchema } from "./mediaResponse.js";
import SourceResponse, { SourceResponseSchema } from "./sourceResponse.js";

export default interface ItemResponse {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  isVideo: boolean;
  isGallery: boolean;
  urls: MediaResponse[];
  filters: FilterResponse[];
  poster?: string;
  author?: AuthorResponse;
  date?: string;
  source?: SourceResponse;
}

export const ItemResponseSchema = S.object()
  .id("ItemResponse")
  .title("ItemResponse")
  .description("Item Response")
  .prop("id", S.string().required())
  .prop("name", S.string().required())
  .prop("description", S.string())
  .prop("width", S.number().required())
  .prop("height", S.number().required())
  .prop("isVideo", S.boolean().required())
  .prop("isGallery", S.boolean().required())
  .prop("date", S.string())
  .prop("poster", S.string())
  .prop("urls", S.array().items(MediaResponseSchema))
  .prop("filters", S.array().items(FilterResponseSchema))
  .prop("author", AuthorResponseSchema)
  .prop("source", SourceResponseSchema);
