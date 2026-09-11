import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [tailwind()],
  server: {
    port: 4322,
    host: true, // 绑定到 0.0.0.0，同时支持 IPv4 和 IPv6 访问
  },
  vite: {
    server: {
      allowedHosts: [
        'yusuf-mac-mini.tail5cb35.ts.net',
      ],
      // 或者也可以写为 allowedHosts: true
    },
  },
});