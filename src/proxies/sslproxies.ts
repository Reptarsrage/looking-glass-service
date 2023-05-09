import axios from "axios";
import * as cheerio from "cheerio";
import type { AxiosProxyConfig } from "axios";
import invariant from "tiny-invariant";

import { getRandomUserAgent } from "./userAgents.js";

async function _fetchProxies(
  url: string,
  protocol: "http" | "https" | "socks4" | "socks5"
): Promise<AxiosProxyConfig[]> {
  try {
    const response = await axios.get<string>(url, {
      headers: {
        "accept-encoding": "text/html",
        referer: "https://sslproxies.org/",
        "user-agent": getRandomUserAgent(),
      },
    });
    const $ = cheerio.load(response.data);

    const hostsList = $(".modal-body textarea").val();
    invariant(hostsList, "Failed to fetch proxy list from https://sslproxies.org/");

    const hosts = hostsList
      .toString()
      .split("\n")
      .filter((s) => s.match(/^\d+/));

    return hosts.map((host) => ({
      protocol,
      host: host.split(":")[0],
      port: parseInt(host.split(":")[1]),
    }));
  } catch (e) {
    console.error("Failed to fetch proxy list from https://sslproxies.org/");
    return [];
  }
}

async function fetchProxies() {
  const proxies = await Promise.all([
    _fetchProxies("https://sslproxies.org/", "http"),
    _fetchProxies("https://www.us-proxy.org/", "http"),
    _fetchProxies("https://free-proxy-list.net/", "http"),
    _fetchProxies("https://free-proxy-list.net/uk-proxy.html", "http"),
    _fetchProxies("https://free-proxy-list.net/anonymous-proxy.html", "http"),
    _fetchProxies("https://www.socks-proxy.net/", "socks4"),
  ]);

  return proxies.flat();
}

export default fetchProxies;
