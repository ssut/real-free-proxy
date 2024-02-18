import type { Agent as HttpAgent } from 'http';
import type { Agent as HttpsAgent } from 'https';
import axios, { type AxiosInstance } from 'axios';
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import type { ProxyServer } from '../common/types.ts';

export interface ConnectivityCheckerTarget {
  url: string;
}

export interface ConnectivityCheckerOptions {
  targets?: ConnectivityCheckerTarget[];
  checkerFn?: (targets: ConnectivityCheckerTarget[], client: AxiosInstance) => Promise<boolean>;
  timeoutMs?: number;
}

export const checkProxyConnectivity = async (proxyServer: ProxyServer, options?: ConnectivityCheckerOptions) => {
  const { timeoutMs = 5000 } = options ?? {};

  let httpAgent: HttpAgent;
  let httpsAgent: HttpsAgent;
  switch (proxyServer.protocol) {
    case 'http':
      httpAgent = new HttpProxyAgent({
        proxy: `http://${proxyServer.host}:${proxyServer.port}`,
        timeout: timeoutMs,
      });
      httpsAgent = new HttpsProxyAgent({
        proxy: `http://${proxyServer.host}:${proxyServer.port}`,
        timeout: timeoutMs,
      });
      break;

    case 'https':
      httpAgent = new HttpProxyAgent({
        proxy: `https://${proxyServer.host}:${proxyServer.port}`,
        timeout: timeoutMs,
      });
      httpsAgent = new HttpsProxyAgent({
        proxy: `https://${proxyServer.host}:${proxyServer.port}`,
        timeout: timeoutMs,
      });
      break;

    case 'socks4':
    case 'socks5':
      {
        const agent = new SocksProxyAgent(`${proxyServer.protocol}://${proxyServer.host}:${proxyServer.port}`, {
          timeout: timeoutMs,
        });
        httpAgent = agent;
        httpsAgent = agent;
      }
      break;

    default:
      throw new Error(`Not supported proxy protocol: ${proxyServer.protocol}`);
  }

  const client = axios.create({
    httpAgent,
    httpsAgent,
    timeout: timeoutMs,
  });

  const {
    targets = [
      {
        url: '//clients3.google.com/generate_204',
      },
      {
        url: '//www.gstatic.com/generate_204',
      },
    ],
    checkerFn,
  } = options ?? {};

  const protocol = proxyServer.https ? 'https' : 'http';
  for (const target of targets) {
    target.url = `${protocol}://${target.url}`;
  }

  if (typeof checkerFn === 'function') {
    return checkerFn(targets, client);
  }

  const abortController = new AbortController();
  try {
    const response = await Promise.race([
      client.get(`${protocol}://clients3.google.com/generate_204`, {
        signal: abortController.signal,
      }),
      client.get(`${protocol}://www.gstatic.com/generate_204`, {
        signal: abortController.signal,
      }),
    ]);

    return response.status === 204;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    abortController.abort();
  }
};
