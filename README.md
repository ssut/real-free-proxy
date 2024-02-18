# Real Free Proxy

Real Free Proxy is a *working* free proxy list resolver that is based on the free proxy list from various sources.

## Currently Supported Sources

- [FreeProxyList](https://freeproxylist.net/)
- [SSLProxies](https://www.sslproxies.org/)

## Usage

```typescript
const rfp = new RealFreeProxy();
const proxyServers = await rfp.getProxyServers();
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
