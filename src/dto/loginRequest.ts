import S from "fluent-json-schema";

export default interface LoginRequest {
  username: string;
  password: string;
}

export const LoginRequestSchema = S.object()
  .id("LoginRequest")
  .title("LoginRequest")
  .description("Login Request")
  .prop("username", S.string().required())
  .prop("password", S.string().required());
