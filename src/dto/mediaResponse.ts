import { S } from "fluent-json-schema";

export default interface MediaResponse {
  width: number;
  height: number;
  url: string;
}

export const MediaResponseSchema = S.object()
  .id("MediaResponse")
  .title("MediaResponse")
  .description("Media Response")
  .prop("url", S.string().required())
  .prop("width", S.number().required())
  .prop("height", S.number().required());
