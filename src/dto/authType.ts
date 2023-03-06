import { S } from "fluent-json-schema";

/** authentication method used by the module */
enum AuthType {
  /** no authentication */
  None = "",

  /** oauth 2.0 */
  OAuth = "oauth",

  /** http basic authentication */
  Basic = "login",

  /** http authentication without need for user interaction */
  Implicit = "implicit",
}

export default AuthType;

export const AuthTypeSchema = S.enum(["", "oauth", "login", "implicit"])
  .id("AuthType")
  .title("AuthType")
  .description("Auth Type");
