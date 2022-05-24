import tap from "tap";
import axios from "axios";
import { build } from "./app";
import { AddressInfo } from "net";

tap.test("E2E GET `/` route", async (t) => {
  t.plan(3);

  const fastify = build();
  t.teardown(() => fastify.close());

  await fastify.listen(0);
  const response = await axios.get("http://localhost:" + (fastify.server.address() as AddressInfo).port);

  t.equal(response.status, 200);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.matchSnapshot(response.data);
});

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
      t.matchSnapshot(response.json());
    }
  );
});
