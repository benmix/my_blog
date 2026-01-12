import { getSlugs, loader } from "fumadocs-core/source";
import { allPosts } from "content-collections";
import type { BlogPage } from "@/types/blog";
import { createMDXSource } from "@fumadocs/content-collections";

function normalizeToc(toc?: { title: string; url: string; depth: number }[]) {
  if (!toc) {
    return;
  }

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
  slugs: (file) => getSlugs(file.path),
});

const pages: BlogPage[] = blogLoader.getPages().map((page) => {
  const toc = normalizeToc(page.data.toc);

  return {
    ...page,
    toc,
  };
});

export const blogSource = {
  async getPages() {
    return pages;
  },

  async getPage(slugs: string[]) {
    return pages.find((page) => {
      return page.slugs.join("/") === slugs.join("/");
    });
  },
};
