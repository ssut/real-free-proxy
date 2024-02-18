import type { ProxyServer } from './types';

export interface GetProxyServersOptions {
  countryCodes?: string[];
  countryCodesToExclude?: string[];
  https?: boolean;
}

export interface Provider {
  checkRegionAvailability(region: string): boolean;
  getProxyServers(options: GetProxyServersOptions): Promise<ProxyServer[]>;
}
