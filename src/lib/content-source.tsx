import type { BlogPage } from "@/types";
import { MDXContent } from "@content-collections/mdx/react";
import { createMDXSource } from "@fumadocs/content-collections";
import { allPosts } from "content-collections";
import { getSlugs, loader } from "fumadocs-core/source";

function createBodyComponent(code?: string) {
  if (!code) return undefined;
  const Body = (props: any) => <MDXContent code={code} {...props} />;
  Body.displayName = "PostBody";
  return Body;
}

function normalizeSlugs(slugs?: string[], fallbackPath?: string) {
  if (slugs && slugs.length > 0) return slugs;
  if (!fallbackPath) return [];
  return fallbackPath.split("/").filter(Boolean);
}

function normalizeToc(toc?: { title: string; url: string; depth: number }[]) {
  if (!toc) return undefined;
  return toc
    .filter((item) => item.depth <= 3)
    .map((item) => {
      const hash = item.url.split("#").pop() ?? "";
      const id = decodeURIComponent(hash);
      return { id, title: item.title };
    })
    .filter((item) => item.id && item.title);
}

const source = createMDXSource(allPosts, []);
const blogLoader = loader(source, {
  baseUrl: "/posts",
  slugs: (file) => file.data.slugs ?? getSlugs(file.path),
});

const pages: BlogPage[] = blogLoader.getPages().map((page) => {
  const slugs = normalizeSlugs(page.slugs, page.path);

  const toc = normalizeToc(
    page.data.toc as { title: string; url: string; depth: number }[] | undefined
  );

  return {
    data: {
      title: page.data.title,
      title_en: page.data.title_en,
      date: page.data.date,
      tags: page.data.tags ?? [],
      readingTime: page.data.readingTime,
    },
    toc,
    body: createBodyComponent(page.data.mdx as string),
    source: page.path,
    slugs,
    url: page.url ?? `/posts/${slugs.join("/")}`,
  } satisfies BlogPage;
});

export const blogSource = {
  async getPages() {
    return pages;
  },

  async getPage(slugs: string[]) {
    const joined = slugs.join("/");
    return pages.find((page) => (page.slugs ?? []).join("/") === joined);
  },
};
