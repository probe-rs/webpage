// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";

import expressiveCode from 'astro-expressive-code';

import preact from '@astrojs/preact';

// UPDATE these if deploying somewhere new!
const site = 'https://julianguide.github.io';

// UPDATE this if serving from a different base path.
// E.g., 'my-repo' for a site at my-git.github.io/my-repo/, or '' for 'probe.rs/'.
const base = 'probe.rs-astro';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    expressiveCode(),  // Must go before mdx() to add code blocks
    mdx(),
    sitemap(),
    icon({ iconDir: 'src/icons' }),
    preact(),
  ],

  vite: {
    plugins: [tailwindcss(), icon()],
    server: {
      // ssh -R 80:localhost:4321 serveo.net
      allowedHosts: ['.serveo.net'],
    },
  },

  compressHTML: true,
});