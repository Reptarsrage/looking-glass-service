import axios from "axios";
import type { FastifyReply } from "fastify";
import type { Readable } from "node:stream";

export default async function stream(
  url: string,
  headers: Record<string, string | undefined>,
  reply: FastifyReply,
  tries = 3
): Promise<void> {
  try {
    const response = await axios.get<Readable>(url, {
      headers,
      responseType: "stream",
    });

    if (response.status >= 200 && response.status < 400) {
      response.headers["cache-control"] = "public, max-age=3600";
      delete response.headers["etag"];
      delete response.headers["age"];
      delete response.headers["date"];
      delete response.headers["expires"];
      delete response.headers["last-modified"];
    }

    reply.raw.writeHead(response.status, response.headers);
    response.data.pipe(reply.raw);
  } catch (error: unknown) {
    if (tries >= 0) {
      await stream(url, headers, reply, tries - 1);
      return;
    }

    reply.send(error);
  }
}
