import { createMDXSource } from "@fumadocs/content-collections";
import { allPosts } from "content-collections";
import { getSlugs, loader } from "fumadocs-core/source";

import type { BlogPage } from "@/types/blog";
import { getPageSlugSegments } from "@lib/post-path";

function normalizeToc(toc?: { title: string; url: string; depth: number }[]) {
  if (!toc) {
    return;
  }

  return toc
    .filter((item) => item.depth >= 3 && item.depth <= 4)
    .map((item) => {
      const hash = item.url.split("#").pop() ?? "";
      const id = decodeURIComponent(hash);
      return { depth: item.depth, id, title: item.title };
    })
    .filter((item) => item.id && item.title);
}

const source = createMDXSource(allPosts, []);

const blogLoader = loader(source, {
  baseUrl: "/posts",
  slugs: (file) => getSlugs(file.path),
});

const pages: BlogPage[] = blogLoader.getPages().map((page) => {
  const toc = normalizeToc(page.data.toc);
  const slugs = getPageSlugSegments(page);

  return {
    ...page,
    ...(slugs ? { slugs } : {}),
    toc,
  };
});

export const blogSource = {
  async getPages() {
    return pages;
  },

  async getPage(slugs: string[]) {
    return pages.find((page) => {
      const pageSlugs = getPageSlugSegments(page);
      return pageSlugs?.join("/") === slugs.join("/");
    });
  },
};
