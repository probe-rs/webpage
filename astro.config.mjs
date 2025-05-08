// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import expressiveCode from "astro-expressive-code";

import preact from "@astrojs/preact";
import pagefind from "astro-pagefind";

// UPDATE these if deploying somewhere new!
const site = "https://probe.rs";

// UPDATE this if serving from a different base path.
// E.g., 'my-repo' for a site at my-git.github.io/my-repo/, or '' for 'probe.rs/'.
const base = "";

// https://astro.build/config
export default defineConfig({
  site,
  base,
  build: {
    format: "directory",
  },
  integrations: [
    expressiveCode({ themes: ["vitesse-light", "vitesse-dark"] }), // Must go before mdx() to add code blocks
    mdx(),
    sitemap(),
    icon({ iconDir: "src/icons" }),
    preact(),
    pagefind(),
  ],

  vite: {
    plugins: [tailwindcss(), icon()],
    server: {
      // ssh -R 80:localhost:4321 serveo.net
      allowedHosts: [".serveo.net"],
    },
  },

  compressHTML: true,
});
