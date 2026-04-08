// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import remarkGfm from 'remark-gfm';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare(),
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});