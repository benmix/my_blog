import { defineCollection, defineConfig } from "@content-collections/core";
import remarkMath from "remark-math";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { z } from "zod";
import { transformMDX } from "@fumadocs/content-collections/configuration";
import type { ThemeRegistrationAny } from "shiki";

import flexokiDark from "./src/styles/flexoki-dark.json";
import flexokiLight from "./src/styles/flexoki-light.json";

const lightTheme = flexokiLight as ThemeRegistrationAny;
const darkTheme = flexokiDark as ThemeRegistrationAny;

const posts = defineCollection({
  name: "posts",
  directory: "src/content",
  include: "**/*.md",
  schema: z.object({
    title: z.string().optional(),
    title_en: z.string().optional(),
    date: z.union([z.date(), z.string()]).optional(),
    tags: z.array(z.string()).optional(),
    readingTime: z.object({ text: z.string() }).optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const compiled = await transformMDX(doc, context, {
      remarkPlugins: (plugins) => [remarkMath, ...plugins],
      rehypePlugins: (plugins) => [
        rehypeSlug,
        rehypeKatex,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ...plugins,
      ],
      rehypeCodeOptions: {
        themes: {
          light: lightTheme,
          dark: darkTheme,
        },
        lazy: false,
      },
    });

    const slugs = doc._meta.path.split("/").filter(Boolean);

    return {
      ...compiled,
      mdx: compiled.body,
      slugs,
      url: `/posts/${slugs.join("/")}`,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
