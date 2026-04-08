import type { BlogPage, TocItem } from "@/types/blog";
import { splitSlugPath } from "@lib/post-path";

type SourcePageLike = {
  data: {
    slug: string;
    toc?: { title: string; url: string; depth: number }[];
    url: string;
  };
  source?: string;
  slugs?: string[];
  url?: string;
};

export function normalizeToc(toc?: { title: string; url: string; depth: number }[]) {
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

export function toBlogPage<T extends SourcePageLike>(
  page: T,
): T & Pick<BlogPage, "slugs" | "toc" | "url"> {
  const toc = normalizeToc(page.data.toc);
  const slugs = splitSlugPath(page.data.slug);

  return {
    ...page,
    url: page.data.url,
    slugs,
    toc: toc as TocItem[] | undefined,
  };
}
