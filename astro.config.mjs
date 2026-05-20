import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-mdx-knowledge-base.pages.dev',
  trailingSlash: 'never',
  output: 'static',

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  integrations: [
    mdx({
      gfm: true,
      smartypants: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },

  adapter: cloudflare()
});