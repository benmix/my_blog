import type { BlogPage } from "@/types/blog";
import { getSiteLocale, isSiteLocale, type SiteLocale } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";

type PostRouteResolution =
  | { kind: "invalid-locale" }
  | { canonicalPath: string; kind: "render"; locale: SiteLocale };

export function resolvePostRoute(
  localeParam: string,
  page: Pick<BlogPage, "slugs" | "source" | "url">,
): PostRouteResolution {
  if (!isSiteLocale(localeParam)) {
    return { kind: "invalid-locale" };
  }

  const locale = getSiteLocale(localeParam);
  const canonicalPath = getPageHref(page, locale);

  if (!canonicalPath) {
    return { kind: "invalid-locale" };
  }

  return { kind: "render", locale, canonicalPath };
}

export function resolvePostMetadataContext(
  localeParam: string,
  page: Pick<BlogPage, "slugs" | "source" | "url">,
) {
  if (!isSiteLocale(localeParam)) {
    return null;
  }

  const locale = getSiteLocale(localeParam);
  const href = getPageHref(page, locale);

  if (!href) {
    return null;
  }

  return {
    href,
    hrefEn: getPageHref(page, "en"),
    hrefZh: getPageHref(page, "zh"),
    locale,
  };
}

export function resolveLegacyPostRedirect(
  page: Pick<BlogPage, "slugs" | "source" | "url">,
  locale: SiteLocale,
) {
  return getPageHref(page, locale);
}
