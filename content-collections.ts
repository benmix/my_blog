import { defineCollection, defineConfig } from "@content-collections/core";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { z } from "zod";
import { transformMDX } from "@fumadocs/content-collections/configuration";
import type { ThemeRegistrationAny } from "shiki";

import flexokiDark from "./src/styles/flexoki-dark.json";
import flexokiLight from "./src/styles/flexoki-light.json";

const lightTheme = flexokiLight as ThemeRegistrationAny;
const darkTheme = flexokiDark as ThemeRegistrationAny;
const CHARS_PER_MINUTE = 400;

function estimateReadingTime(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return undefined;

  const words = normalized.replace(/\s/g, "").length;

  const minutes = Math.max(1, Math.ceil(words / CHARS_PER_MINUTE));

  return { text: `${minutes} min read` };
}

const posts = defineCollection({
  name: "posts",
  directory: "src/content",
  include: "**/*.md",
  schema: z.object({
    title: z.string().optional(),
    title_en: z.string().optional(),
    date: z.union([z.date(), z.string()]).optional(),
    tags: z.array(z.string()).optional(),
    reading_time: z.object({ text: z.string() }).optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const compiled = await transformMDX(doc, context, {
      remarkPlugins: (plugins) => [remarkMath, ...plugins],
      rehypePlugins: (plugins) => [rehypeSlug, rehypeKatex, ...plugins],
      rehypeCodeOptions: {
        themes: {
          light: lightTheme,
          dark: darkTheme,
        },
        lazy: false,
        transformers: [
          {
            pre(node) {
              const title = this.options?.meta?.title;
              node.properties ??= {};
              node.properties["data-copy"] = "";
              node.properties["data-filename"] = title;
            },
          },
        ],
      },
    });

    const reading_time = estimateReadingTime(doc.content);

    return {
      ...compiled,
      reading_time,
      mdx: compiled.body,
      url: `/posts/${doc._meta.path}`,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
