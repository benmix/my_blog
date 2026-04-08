import type { BlogPage } from "@/types/blog";
import type { SiteLocale } from "@lib/i18n";

type PageLike = Pick<BlogPage, "slugs" | "source"> & {
  url?: BlogPage["url"];
};

type SlugPageLike = Pick<PageLike, "slugs" | "source">;

export function splitSlugPath(slugPath: string) {
  return slugPath.split("/").filter(Boolean);
}

export function getPageSlugSegments(page: SlugPageLike) {
  const slugs = page.slugs?.filter(Boolean);
  if (slugs?.length) {
    return slugs;
  }
}

export function getCanonicalSlugPath(page: SlugPageLike) {
  const slugs = getPageSlugSegments(page);
  return slugs?.join("/");
}

export function getLeafSlug(page: SlugPageLike) {
  const slugs = getPageSlugSegments(page);
  return slugs?.[slugs.length - 1];
}

export function getSlugKey(slugs: string[]) {
  return slugs.filter(Boolean).join("/");
}

export function buildPageSlugIndex<T extends SlugPageLike>(pages: T[]) {
  const index = new Map<string, T>();

  for (const page of pages) {
    const pageSlugs = getPageSlugSegments(page);
    if (!pageSlugs?.length) {
      continue;
    }

    const key = getSlugKey(pageSlugs);
    const existingPage = index.get(key);
    if (existingPage) {
      const existingSource = existingPage.source || "<unknown>";
      const nextSource = page.source || "<unknown>";
      throw new Error(
        `Duplicate post slug "${key}" found for "${existingSource}" and "${nextSource}"`,
      );
    }

    index.set(key, page);
  }

  return index;
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
