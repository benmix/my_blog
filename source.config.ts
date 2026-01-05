import { defineConfig } from "fumadocs-mdx/config";

export default defineConfig({
  mdxOptions: {
    remarkHeadingOptions: {
      generateToc: true,
    },
    rehypeCodeOptions: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
      lazy: false,
      defaultColor: false,
    },
  },
});
