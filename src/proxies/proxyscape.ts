import axios from "axios";
import type { AxiosProxyConfig } from "axios";

import { getRandomUserAgent } from "./userAgents.js";

async function _fetchProxies(protocol: "http" | "https" | "socks4" | "socks5"): Promise<AxiosProxyConfig[]> {
  try {
    const url = `https://api.proxyscrape.com/v2/?request=getproxies&protocol=${protocol}}&timeout=10000&country=all&ssl=all&anonymity=all`;
    const response = await axios.get<string>(url, {
      headers: {
        "accept-encoding": "text/plain",
        referer: "https://api.proxyscrape.com/",
        "user-agent": getRandomUserAgent(),
      },
    });

    return response.data
      .split(/\s+/)
      .map((domain) => ({
        protocol,
        host: domain.split(":")[0],
        port: parseInt(domain.split(":")[1]),
      }))
      .filter((config) => !isNaN(config.port) && /^[\d.]+$/.test(config.host));
  } catch (e) {
    console.error("Failed to fetch proxy list from https://api.proxyscrape.com/");
    return [];
  }
}

async function fetchProxies() {
  const proxies = await Promise.all([
    _fetchProxies("http"),
    // _fetchProxies('https'), // Super slow and almost none work
    _fetchProxies("socks4"),
    _fetchProxies("socks5"),
  ]);

  return proxies.flat();
}

export default fetchProxies;
