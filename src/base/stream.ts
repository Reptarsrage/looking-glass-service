import axios from "axios";
import type { FastifyReply } from "fastify";
import type { Readable } from "node:stream";

export default async function stream(
  url: string,
  headers: Record<string, string>,
  reply: FastifyReply,
  tries = 3
): Promise<void> {
  try {
    const response = await axios.get<Readable>(url, {
      headers,
      responseType: "stream",
    });

    if (response.status >= 200 && response.status < 400) {
      response.headers["cache-control"] = "max-age=3600, must-revalidate";
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
