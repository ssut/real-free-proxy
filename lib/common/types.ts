export type ProxyServerAnonymity = 'transparent' | 'anonymous' | 'elite';

export type ProxyServerProtocol = 'http' | 'https' | 'socks4' | 'socks5';

export interface ProxyServer {
  protocol: ProxyServerProtocol;
  host: string;
  port: number;
  region?: string;
  anonymity?: string;
  https?: boolean;
  lastCheckedAt?: Date;
}
