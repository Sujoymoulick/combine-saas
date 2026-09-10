import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: { port: 3000 },
  integrations: [clerk(), tailwind()],
});