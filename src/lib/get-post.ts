import { toDate } from "date-fns";

import type { BlogPage } from "@/types/blog";
import { blogSource } from "@lib/content-source";
import { getLeafSlug } from "@lib/post-path";

export async function getPosts() {
  const pages = (await blogSource.getPages()) as BlogPage[];
  return pages
    .sort((a, b) => toDate(b.data.date ?? 0).getTime() - toDate(a.data.date ?? 0).getTime())
    .filter((post) => getLeafSlug(post) !== "index");
}

export async function getTags() {
  const posts = await getPosts();
  const tags = posts.flatMap((post) => post.data.tags ?? []);
  return tags;
}
