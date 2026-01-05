import { defineConfig } from "fumadocs-mdx/config";
import flexokiDark from "./src/styles/flexoki-dark.json";
import flexokiLight from "./src/styles/flexoki-light.json";

export default defineConfig({
  mdxOptions: {
    remarkHeadingOptions: {
      generateToc: true,
    },
    rehypeCodeOptions: {
      themes: {
        light: flexokiLight,
        dark: flexokiDark,
      },
      lazy: false,
      defaultColor: false,
    },
  },
});
