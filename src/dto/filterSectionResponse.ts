import S from "fluent-json-schema";

export default interface FilterSectionResponse {
  id: string;
  name: string;
  description: string;
  supportsMultiple: boolean;
  supportsSearch: boolean;
}

export const FilterSectionResponseSchema = S.object()
  .id("FilterSectionResponse")
  .title("FilterSectionResponse")
  .description("Filter Section Response")
  .prop("id", S.string().required())
  .prop("name", S.string().required())
  .prop("description", S.string().required())
  .prop("supportsMultiple", S.boolean().required())
  .prop("supportsSearch", S.boolean().required());
