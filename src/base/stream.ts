import axios, { AxiosRequestHeaders } from "axios";
import type { FastifyReply } from "fastify";
import type { Readable } from "node:stream";

export default async function stream(url: string, headers: AxiosRequestHeaders, res: FastifyReply): Promise<void> {
  try {
    const response = await axios.get<Readable>(url, {
      headers,
      responseType: "stream",
    });

    if (response.status >= 200 && response.status < 300) {
      response.headers["cache-control"] = "public, max-age=31536000";
    }

    response.data.pipe(res.raw);
  } catch (error: unknown) {
    res.send(error);
  }
}
