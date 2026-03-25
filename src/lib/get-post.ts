import type { BlogPage } from "@/types/blog";
import { blogSource } from "@lib/content-source";
import { getPageSlugSegments } from "@lib/post-path";
import { toDate } from "date-fns";

export async function getPosts() {
  const pages = (await blogSource.getPages()) as BlogPage[];
  return pages
    .sort((a, b) => toDate(b.data.date ?? 0).getTime() - toDate(a.data.date ?? 0).getTime())
    .map((page) => {
      const slugs = getPageSlugSegments(page);
      if (!page.slugs?.length && slugs?.length) {
        return { ...page, slugs };
      }
      return page;
    })
    .filter((post) => (post.slugs?.[post.slugs.length - 1] || "") !== "index");
}

export async function getTags() {
  const posts = await getPosts();
  const tags = posts.flatMap((post) => post.data.tags ?? []);
  return tags;
}
