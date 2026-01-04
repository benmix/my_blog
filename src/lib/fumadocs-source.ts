import path from "node:path";
import { createMDXSource } from "fumadocs-mdx";
import { FileSystemReader } from "fumadocs-core/source";
import { z } from "zod";

const reader = new FileSystemReader({
  base: path.join(process.cwd(), "src/content"),
  prefix: "/posts",
});

export const blogSource = createMDXSource({
  reader,
  schema: z.object({
    title: z.string().optional(),
    title_en: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
  mdxOptions: {
    readingTime: true,
    toc: true,
  },
});
