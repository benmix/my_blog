// source.config.ts
import { defineConfig } from "fumadocs-mdx/config";
var source_config_default = defineConfig({
  mdxOptions: {
    remarkHeadingOptions: {
      generateToc: true
    },
    rehypeCodeOptions: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default"
      },
      lazy: false,
      defaultColor: false
    }
  }
});
export {
  source_config_default as default
};
