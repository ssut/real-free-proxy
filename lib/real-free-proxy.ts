import EventEmitter from 'node:events';
import type { ProxyServer, ProxyServerProtocol } from './common/types.ts';

export interface RealFreeProxyEvents {
  proxy: { proxy: ProxyServer };
}

export declare interface RealFreeProxy {
  // on<K extends keyof RealFreeProxyEvents>(event: K, listener: (arg: RealFreeProxyEvents[K]) => void): this;
  on(event: 'proxy', listener: (proxy: ProxyServer) => void): this;
}

export type RealFreeProxyProvider = 'free-proxy-list' | 'ssl-proxies' | 'uk-proxy' | 'us-proxy';

export interface RealFreeProxyOptions {
  providers?: RealFreeProxyProvider[];
  countryCodes?: string;
  countryCodesToExclude?: string[];
  protocols?: ProxyServerProtocol[];
  https?: boolean;
  connectivityChecker?:
    | {
        timeout?: number;
        urls?: [];
      }
    | false;
}

export class RealFreeProxy extends EventEmitter {
  public constructor(
    public defaultOptions: RealFreeProxyOptions = {
      providers: ['free-proxy-list', 'ssl-proxies', 'uk-proxy', 'us-proxy'],
      countryCodesToExclude: ['CN', 'RU'],
      https: true,
      connectivityChecker: {
        timeout: 5000,
      },
    },
  ) {
    super();
  }

  public getProxyServers(options?: RealFreeProxyOptions) {
    const sessionOptions = Object.assign({}, this.defaultOptions, structuredClone(options));
  }

  public poll() {
    const abortController = new AbortController();

    return { abortController };
  }
}
