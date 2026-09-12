import clerk from '@clerk/astro';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 4321,
    host: true,
  },
  integrations: [
    clerk({
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    }),
    tailwind(),
  ],
});