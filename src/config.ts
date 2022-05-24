import type { LevelWithSilent } from "pino";
import type { JSONSchemaType } from "ajv";

export interface Config {
  NODE_ENV: "development" | "production" | "test";
  HOST: string;
  PORT: number;
  REDDIT_CLIENT_ID: string;
  REDDIT_USER_AGENT: string;
  IMGUR_CLIENT_ID: string;
  GIPHY_API_KEY: string;
  PIXIV_CLIENT_ID: string;
  PIXIV_CLIENT_SECRET: string;
  PIXIV_HASH_SECRET: string;
  LOG_LEVEL?: LevelWithSilent;
}

const schema: JSONSchemaType<Config> = {
  type: "object",
  required: ["NODE_ENV"],
  properties: {
    NODE_ENV: { type: "string", enum: ["development", "production", "test"] },
    LOG_LEVEL: { type: "string", enum: ["fatal", "error", "warn", "info", "debug", "trace", "silent"], nullable: true },
    HOST: { type: "string" },
    PORT: { type: "number" },
    REDDIT_CLIENT_ID: { type: "string" },
    REDDIT_USER_AGENT: { type: "string" },
    IMGUR_CLIENT_ID: { type: "string" },
    GIPHY_API_KEY: { type: "string" },
    PIXIV_CLIENT_ID: { type: "string" },
    PIXIV_CLIENT_SECRET: { type: "string" },
    PIXIV_HASH_SECRET: { type: "string" },
  },
};

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export default schema;
