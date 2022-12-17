import type { AxiosProxyConfig } from "axios";
import axios from "axios";
import * as cheerio from "cheerio";
import userAgents from "./userAgents";

async function fetchProxies(): Promise<AxiosProxyConfig[]> {
  try {
    const response = await axios.get<string>("https://hidemy.name/en/proxy-list/?type=s#list", {
      headers: {
        "accept-encoding": "text/html",
        referer: "https://hidemy.name/",
        "user-agent": userAgents[Math.floor(Math.random() * (userAgents.length - 1))].useragent,
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
    console.error("Failed to fetch proxy list from https://hidemy.name");
    return [];
  }
}

export default fetchProxies;
