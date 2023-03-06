import { setMaxListeners } from "node:events";
import type { Readable } from "node:stream";

import invariant from "tiny-invariant";
import axios from "axios";
import type { FastifyReply } from "fastify";
import type { AxiosProxyConfig, AxiosRequestConfig } from "axios";

import hidemyname from "./hidemyname.js";
import proxyscape from "./proxyscape.js";
import sslproxies from "./sslproxies.js";
import spysone from "./spysone.js";
import freeproxylists from "./freeproxylists.js";
import { getRandomUserAgent } from "./userAgents.js";

const BATCH_SIZE = 20;

// Used to cache proxies list for an hour
let expires: Date | null = null;
let proxies: AxiosProxyConfig[] = [];
let promise: Promise<AxiosProxyConfig[]> | null = null;

/**
 * Collects a list of proxies from all providers
 */
async function collateProxies(): Promise<AxiosProxyConfig[]> {
  const allProxies = await Promise.all([hidemyname(), proxyscape(), sslproxies(), spysone(), freeproxylists()]);
  const proxies = allProxies.flat();
  console.log(`Fetched ${proxies.length} proxies.`);
  return proxies;
}

/**
 * Gets cache proxy list of fetches new list if cache is expired
 */
async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  // check for expired token
  if ((expires && expires < new Date()) || (expires && proxies.length === 0)) {
    expires = null;
    promise = null;
    proxies = [];
  }

  if (!expires) {
    if (!promise) {
      promise = collateProxies();
    }

    proxies = await promise;
    expires = new Date();
    expires.setSeconds(expires.getSeconds() + 3600);
  }

  return proxies;
}

/**
 * Makes an HTTP request using a random proxy
 */
async function fetchUsingRandomProxy<T>(config: AxiosRequestConfig): Promise<T> {
  // Get list pof proxies
  await fetchProxies();

  // Choose random proxy (TODO: round-robin?)
  const proxy = proxies[Math.floor(Math.random() * (proxies.length - 1))];

  try {
    // Make request
    const response = await axios.request<T>({
      ...config,
      proxy,
    });

    // Check response
    invariant(response.status === 200);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const code = e.code;
      // Prune proxies which have actual errors
      // ERR_CANCELED is thrown when the request is canceled by the AbortController
      // ECONNABORTED is a timeout error
      if (code !== "ERR_CANCELED") {
        proxies = proxies.filter((p) => p !== proxy);
        // console.log(`Removed proxy: ${proxy.host} from ${proxies.length} proxies (${e.code}).`)
      }
    }

    throw e;
  }
}

export async function streamWithProxy(config: AxiosRequestConfig, reply: FastifyReply, tries = 3): Promise<void> {
  try {
    const defaultConfig = {
      timeout: 10000,
      headers: {
        "user-agent": getRandomUserAgent(),
      },
    } satisfies AxiosRequestConfig;

    const useConfig = {
      ...defaultConfig,
      ...config,
      headers: {
        ...defaultConfig.headers,
        ...(config.headers as Record<string, string>),
      },
      responseType: "stream",
    } satisfies AxiosRequestConfig;

    const response = await axios.request<Readable>(useConfig);
    const headers = Object.keys(response.headers).reduce((acc, header) => {
      const value = response.headers[header];
      if (value) {
        acc[header] = value.toString();
      }

      return acc;
    }, {} as Record<string, string>);

    if (response.status >= 200 && response.status < 400) {
      headers["cache-control"] = "max-age=31536000, must-revalidate";
      delete headers["etag"];
      delete headers["age"];
      delete headers["date"];
      delete headers["expires"];
      delete headers["last-modified"];
    }

    reply.raw.writeHead(response.status, headers);
    response.data.pipe(reply.raw);
  } catch (error: unknown) {
    if (tries >= 0) {
      await streamWithProxy(config, reply, tries - 1);
      return;
    }

    reply.send(error);
  }
}

export async function fetchWithProxy<T>(config: AxiosRequestConfig): Promise<T> {
  const defaultConfig = {
    timeout: 10000,
    headers: {
      "user-agent": getRandomUserAgent(),
    },
  } satisfies AxiosRequestConfig;

  const useConfig = {
    ...defaultConfig,
    ...config,
    headers: {
      ...defaultConfig.headers,
      ...(config.headers as Record<string, string>),
    },
  } satisfies AxiosRequestConfig;

  return await fetchUsingRandomProxy<T>(useConfig);
}

export async function fetchWithProxyBatch<T>(config: AxiosRequestConfig, batchSize: number = BATCH_SIZE): Promise<T> {
  const controller = new AbortController();
  setMaxListeners(batchSize, controller.signal);
  const response = await Promise.any(
    [...Array(BATCH_SIZE)].map(() => fetchWithProxy<T>({ ...config, signal: controller.signal }))
  );

  invariant(response, `Failed to fetch ${config.url}`);

  return response;
}
