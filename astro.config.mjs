import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.luisribeiro.dev",
  trailingSlash: "never",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
});
