import { enUS, zhCN } from "date-fns/locale";

export const SITE_LOCALES = ["zh", "en"] as const;
export const DEFAULT_LOCALE = "zh" as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

type SiteDictionary = {
  articleSectionLabel: string;
  articles: string;
  currentIssue: string;
  home: string;
  homeHeroCaption: string;
  homeIntro: string;
  htmlLang: string;
  inThisArticle: string;
  languageLabel: string;
  latestArticles: string;
  latestArticlesIntro: string;
  ogDescription: string;
  selectedWritings: string;
  siteDescription: string;
  siteTitle: string;
};

const SITE_DICTIONARY: Record<SiteLocale, SiteDictionary> = {
  en: {
    articleSectionLabel: "Articles",
    articles: "Articles",
    currentIssue: "Current Issue",
    home: "Home",
    homeHeroCaption:
      "A shoreline held in reserve: light, tide, and enough weather to begin a page.",
    homeIntro:
      "Essays, notes, and technical reading records arranged with a slower reading rhythm.",
    htmlLang: "en",
    inThisArticle: "In This Article",
    languageLabel: "Language",
    latestArticles: "Latest Articles",
    latestArticlesIntro:
      "Recent entries from the archive, arranged as a quieter front page rather than a product feed.",
    ogDescription: "Thoughts on engineering, reading, and life.",
    selectedWritings: "Selected Writings",
    siteDescription: "Essays, notes, and technical reading records.",
    siteTitle: "BenMix's Blog",
  },
  zh: {
    articleSectionLabel: "文章",
    articles: "文章",
    currentIssue: "本期",
    home: "首页",
    homeHeroCaption: "一片被暂时留白的海岸：光线、潮汐，以及足够写下一页的天气。",
    homeIntro: "随笔、技术笔记与阅读记录，以更缓慢的阅读节奏编排。",
    htmlLang: "zh-CN",
    inThisArticle: "目录",
    languageLabel: "语言",
    latestArticles: "最新文章",
    latestArticlesIntro: "最近的文章归档，以更接近报纸头版的方式陈列，而不是产品流式列表。",
    ogDescription: "关于工程、阅读与生活的记录。",
    selectedWritings: "精选文章",
    siteDescription: "随笔、技术笔记与阅读记录。",
    siteTitle: "BenMix 的博客",
  },
};

export function isSiteLocale(value: string): value is SiteLocale {
  return SITE_LOCALES.includes(value as SiteLocale);
}

export function getSiteLocale(value?: string | null): SiteLocale {
  return value && isSiteLocale(value) ? value : DEFAULT_LOCALE;
}

export function getSiteDictionary(locale: SiteLocale) {
  return SITE_DICTIONARY[locale];
}

export function getDateLocale(locale: SiteLocale) {
  return locale === "zh" ? zhCN : enUS;
}

export function getLocalizedTitle(
  data: {
    chinese_name?: string;
    english_name?: string;
  },
  locale: SiteLocale,
) {
  if (locale === "en") {
    return data.english_name ?? data.chinese_name ?? "";
  }

  return data.chinese_name ?? data.english_name ?? "";
}

export function getLocalizedPath(pathname: string, locale: SiteLocale) {
  const sanitizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = sanitizedPath.split("/").filter(Boolean);

  if (segments.length > 0 && isSiteLocale(segments[0])) {
    segments[0] = locale;
    return `/${segments.join("/")}`;
  }

  if (sanitizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${sanitizedPath}`;
}

export function formatReadingTime(readingTimeText: string | undefined, locale: SiteLocale) {
  if (!readingTimeText) {
    return null;
  }

  const match = readingTimeText.match(/^(\d+)\s+min/i);
  if (!match) {
    return readingTimeText;
  }

  const minutes = Number(match[1]);
  if (!Number.isFinite(minutes)) {
    return readingTimeText;
  }

  if (locale === "zh") {
    return `预计阅读 ${minutes} 分钟`;
  }

  return `Est. Read: ${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`;
}
