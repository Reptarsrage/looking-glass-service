import { S } from "fluent-json-schema";

export default interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

export const AuthResponseSchema = S.object()
  .id("AuthResponse")
  .title("AuthResponse")
  .description("Auth Response")
  .prop("accessToken", S.string().required())
  .prop("refreshToken", S.string().required())
  .prop("expiresIn", S.number().required())
  .prop("scope", S.string().required())
  .prop("tokenType", S.string().required());
