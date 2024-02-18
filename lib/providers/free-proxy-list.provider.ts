import { Provider } from '../common/provider.base';
import { ProxyServer } from '../common/types';

export class FreeProxyListProvider implements Provider {
  public checkRegionAvailability(region: string): boolean {
    return true;
  }

  public getProxyServers(): Promise<ProxyServer[]> {}
}
