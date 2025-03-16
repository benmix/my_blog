import { toDate } from "date-fns";
import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap("/posts"),
    route: "/posts",
  });
  return directories
    .sort((a, b) => toDate(b.frontMatter.date) - toDate(a.frontMatter.date))
    .filter((post) => post.name !== "index");
}

export async function getTags() {
  const posts = await getPosts();
  const tags = posts.flatMap((post) => post.frontMatter.tags);
  return tags;
}
