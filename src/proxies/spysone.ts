import type { AxiosProxyConfig } from "axios";
import axios from "axios";
import * as cheerio from "cheerio";
import { getRandomUserAgent } from "./userAgents.js";

async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  try {
    const response = await axios.get<string>("https://spys.one/en/https-ssl-proxy/", {
      headers: {
        "accept-encoding": "text/html",
        referer: "https://spys.one/",
        "user-agent": getRandomUserAgent(),
      },
    });
    const $ = cheerio.load(response.data);

    const hosts = $("tr.spy1x:not(:nth-child(2)), tr.spy1xx")
      .toArray()
      .map((tr) => $(tr).find("td").first())
      .map((td) => {
        $(td).find("script").remove();
        return $(td).find("font").first().text();
      });

    return hosts
      .map((domain) => ({
        protocol: "http",
        host: domain.split(":")[0],
        port: parseInt(domain.split(":")[1]),
      }))
      .filter((config) => !isNaN(config.port) && /^[\d.]+$/.test(config.host));
  } catch (e) {
    console.error("Failed to fetch proxy list from https://spys.one/");
    return [];
  }
}

export default fetchProxies;
