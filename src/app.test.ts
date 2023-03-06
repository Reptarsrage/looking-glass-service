import tap from "tap";
import { S } from "fluent-json-schema";
import Ajv from "ajv";

import { ModuleResponseSchema } from "./dto/moduleResponse.js";
import { build } from "./app.js";

tap.test("GET `/` route", (t) => {
  t.plan(4);

  const fastify = build();
  t.teardown(() => fastify.close());

  fastify.inject(
    {
      method: "GET",
      url: "/",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["content-type"], "application/json; charset=utf-8");

      const ajv = new Ajv.default({ allErrors: true });
      const schema = S.array().items(ModuleResponseSchema);
      const validate = ajv.compile(schema.valueOf());
      t.ok(validate(response.json()));
    }
  );
});
