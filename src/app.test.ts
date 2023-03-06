import type { FastifyInstance } from "fastify";
import { S } from "fluent-json-schema";
import _Ajv from "ajv";

import { ModuleResponseSchema } from "./dto/moduleResponse.js";
import { build } from "./app.js";

const Ajv = _Ajv as unknown as typeof _Ajv.default; // 🥲

describe("example tests", () => {
  let fastify: FastifyInstance;

  beforeAll(() => {
    fastify = build();
  });

  afterAll(() => {
    fastify.close();
  });

  test("GET `/` route", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");

    const ajv = new Ajv({ allErrors: true });
    const schema = S.array().items(ModuleResponseSchema);
    const validate = ajv.compile(schema.valueOf());

    expect(validate(response.json())).toBeTruthy();
  });
});
