import axios from "axios";
import * as cheerio from "cheerio";
import type { AxiosProxyConfig } from "axios";

import { getRandomUserAgent } from "./userAgents.js";

// NOTE: this one has reCAPTCHA and will stop working
async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  try {
    const response = await axios.get<string>(
      "https://www.freeproxylists.net/?c=&pt=&pr=HTTPS&a%5B%5D=0&a%5B%5D=1&a%5B%5D=2&u=50",
      {
        headers: {
          "accept-encoding": "text/html",
          referer: "https://www.freeproxylists.net/",
          "user-agent": getRandomUserAgent(),
        },
      }
    );
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
    console.error("Failed to fetch proxy list from https://www.freeproxylists.net");
    return [];
  }
}

export default fetchProxies;
