import S from "fluent-json-schema";

export default interface SortResponse {
  id: string;
  parentId?: string;
  name: string;
  isDefault: boolean;
  availableInSearch: boolean;
  exclusiveToSearch: boolean;
}

export const SortResponseSchema = S.object()
  .id("SortResponse")
  .title("SortResponse")
  .description("Sort Response")
  .prop("id", S.string().required())
  .prop("name", S.string().required())
  .prop("parentId", S.string())
  .prop("isDefault", S.boolean().required())
  .prop("availableInSearch", S.boolean().required())
  .prop("exclusiveToSearch", S.boolean().required());
