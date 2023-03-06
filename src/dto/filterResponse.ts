import { S } from "fluent-json-schema";

export default interface FilterResponse {
  id: string;
  filterSectionId: string;
  name: string;
}

export const FilterResponseSchema = S.object()
  .id("FilterResponse")
  .title("FilterResponse")
  .description("Filter Response")
  .prop("id", S.string().required())
  .prop("filterSectionId", S.string().required())
  .prop("name", S.string().required());
