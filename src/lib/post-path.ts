import type { BlogPage } from "@/types/blog";
import type { SiteLocale } from "@lib/i18n";

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

export function getPageHref(page: PageLike, locale?: SiteLocale) {
  if (page.url) {
    return locale ? `/${locale}${page.url}` : page.url;
  }

  const slugs = getPageSlugSegments(page);
  if (!slugs?.length) {
    return;
  }

  const href = `/posts/${slugs.join("/")}`;
  return locale ? `/${locale}${href}` : href;
}
