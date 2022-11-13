import S from "fluent-json-schema";

export default interface LoginRequest {
  username: string;
  password: string;
}

export const LoginRequestSchema = S.object()
  .id("LoginRequest")
  .title("LoginRequest")
  .description("Login Request")
  .prop("username", S.string()) // Not required for implicit login
  .prop("password", S.string()); // Not required for implicit login
