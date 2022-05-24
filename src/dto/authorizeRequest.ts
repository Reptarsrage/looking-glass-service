import S from "fluent-json-schema";

export default interface AuthorizeRequest {
  code: string;
}

export const AuthorizeRequestSchema = S.object()
  .id("AuthorizeRequest")
  .title("AuthorizeRequest")
  .description("Authorize Request")
  .prop("code", S.string().required());
