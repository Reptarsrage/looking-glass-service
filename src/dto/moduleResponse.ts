import { S } from "fluent-json-schema";

import { AuthTypeSchema } from "./authType.js";
import { FilterSectionResponseSchema } from "./filterSectionResponse.js";
import { SortResponseSchema } from "./sortResponse.js";
import type AuthType from "./authType.js";
import type FilterSectionResponse from "./filterSectionResponse.js";
import type SortResponse from "./sortResponse.js";

export default interface ModuleResponse {
  id: string;
  name: string;
  description: string;
  authType: AuthType;
  oAuthUrl?: string;
  icon: string;
  filters: FilterSectionResponse[];
  sort: SortResponse[];
  supportsItemFilters: boolean;
  supportsAuthorFilter: boolean;
  supportsSourceFilter: boolean;
}

export const ModuleResponseSchema = S.object()
  .id("ModuleResponse")
  .title("ModuleResponse")
  .description("Module Response")
  .prop("id", S.string().required())
  .prop("name", S.string().required())
  .prop("description", S.string().required())
  .prop("authType", AuthTypeSchema.required())
  .prop("icon", S.string().required())
  .prop("oAuthUrl", S.string())
  .prop("filters", S.array().items(FilterSectionResponseSchema))
  .prop("sort", S.array().items(SortResponseSchema))
  .prop("supportsItemFilters", S.boolean().required())
  .prop("supportsAuthorFilter", S.boolean().required())
  .prop("supportsSourceFilter", S.boolean().required());
