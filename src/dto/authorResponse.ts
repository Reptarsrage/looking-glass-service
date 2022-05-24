import S from "fluent-json-schema";

export default interface AuthorResponse {
  id: string;
  filterSectionId: string;
  name: string;
}

export const AuthorResponseSchema = S.object()
  .id("AuthorResponse")
  .title("AuthorResponse")
  .description("Author Response")
  .prop("id", S.string().required())
  .prop("filterSectionId", S.string().required())
  .prop("name", S.string().required());
