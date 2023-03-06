import axios from "axios";
import * as cheerio from "cheerio";
import type { AxiosProxyConfig } from "axios";

import { getRandomUserAgent } from "./userAgents.js";

async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  try {
    const response = await axios.get<string>("https://sslproxies.org/", {
      headers: {
        "accept-encoding": "text/html",
        referer: "https://sslproxies.org/",
        "user-agent": getRandomUserAgent(),
      },
    });
    const $ = cheerio.load(response.data);

    const hosts: string[] = [];
    $("td:nth-child(1)")
      .toArray()
      .forEach((td) => {
        hosts.push($(td).text());
      });

    const ports: number[] = [];
    $("td:nth-child(2)")
      .toArray()
      .forEach((td) => {
        ports.push(parseInt($(td).text(), 10));
      });

    return hosts
      .map((host, i) => ({
        protocol: "http",
        host: host,
        port: ports[i],
      }))
      .filter((config) => !isNaN(config.port) && /^[\d.]+$/.test(config.host));
  } catch (e) {
    console.error("Failed to fetch proxy list from https://sslproxies.org/");
    return [];
  }
}

export default fetchProxies;
