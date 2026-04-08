import { createMDXSource } from "@fumadocs/content-collections";
import { allPosts } from "content-collections";
import { loader } from "fumadocs-core/source";

import type { BlogPage } from "@/types/blog";
import { toBlogPage } from "@lib/blog-page";
import { buildPageSlugIndex } from "@lib/post-path";
import { getSlugKey } from "@lib/post-path";

const source = createMDXSource(allPosts, []);

const blogLoader = loader(source, {
  baseUrl: "/posts",
});

const pages: BlogPage[] = blogLoader.getPages().map(toBlogPage);

const pageIndex = buildPageSlugIndex(pages);

export const blogSource = {
  async getPages() {
    return pages;
  },

  async getPage(slugs: string[]) {
    return pageIndex.get(getSlugKey(slugs));
  },
};
