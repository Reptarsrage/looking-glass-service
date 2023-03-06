import { S } from "fluent-json-schema";

export default interface SourceResponse {
  id: string;
  filterSectionId: string;
  name: string;
}

export const SourceResponseSchema = S.object()
  .id("SourceResponse")
  .title("SourceResponse")
  .description("Source Response")
  .prop("id", S.string().required())
  .prop("filterSectionId", S.string().required())
  .prop("name", S.string().required());
