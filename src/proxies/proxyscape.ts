import type { AxiosProxyConfig } from "axios";
import axios from "axios";
import { getRandomUserAgent } from "./userAgents";

async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  try {
    const url =
      "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all";
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
        protocol: "http",
        host: domain.split(":")[0],
        port: parseInt(domain.split(":")[1]),
      }))
      .filter((config) => !isNaN(config.port) && /^[\d.]+$/.test(config.host));
  } catch (e) {
    console.error("Failed to fetch proxy list from https://api.proxyscrape.com/");
    return [];
  }
}

export default fetchProxies;
