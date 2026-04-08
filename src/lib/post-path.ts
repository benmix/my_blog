import type { BlogPage } from "@/types/blog";
import type { SiteLocale } from "@lib/i18n";

type PageLike = Pick<BlogPage, "slugs" | "source"> & {
  url?: BlogPage["url"];
};

type SlugPageLike = Pick<PageLike, "slugs" | "source">;

function normalizeSourcePath(source: string) {
  return source.replace(/\.(md|mdx)$/i, "");
}

function normalizeSlugSegment(segment: string) {
  try {
    return decodeURIComponent(segment).normalize("NFC");
  } catch {
    return segment.normalize("NFC");
  }
}

export function getPageSlugSegments(page: SlugPageLike) {
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

export function normalizeSlugSegments(slugs: string[]) {
  return slugs.filter(Boolean).map(normalizeSlugSegment);
}

export function getNormalizedSlugKey(slugs: string[]) {
  return normalizeSlugSegments(slugs).join("/");
}

export function hasCanonicalSlug(slugs: string[]) {
  return getNormalizedSlugKey(slugs) === slugs.filter(Boolean).join("/");
}

export function buildPageSlugIndex<T extends SlugPageLike>(pages: T[]) {
  return new Map(
    pages.flatMap((page) => {
      const pageSlugs = getPageSlugSegments(page);
      if (!pageSlugs?.length) {
        return [];
      }

      return [[getNormalizedSlugKey(pageSlugs), page] as const];
    }),
  );
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
