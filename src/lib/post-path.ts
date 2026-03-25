import type { BlogPage } from "@/types/blog";

type PageLike = Pick<BlogPage, "slugs" | "source"> & {
  url?: BlogPage["url"];
};

function normalizeSourcePath(source: string) {
  return source.replace(/\.(md|mdx)$/i, "");
}

export function getPageSlugSegments(page: Pick<PageLike, "slugs" | "source">) {
  const slugs = page.slugs?.filter(Boolean);
  if (slugs?.length) {
    return slugs;
  }

  if (!page.source) {
    return;
  }

  const parts = normalizeSourcePath(page.source).split("/").filter(Boolean);
  return parts.length ? parts : undefined;
}

export function getPageHref(page: PageLike) {
  if (page.url) {
    return page.url;
  }

  const slugs = getPageSlugSegments(page);
  return slugs?.length ? `/posts/${slugs.join("/")}` : undefined;
}
