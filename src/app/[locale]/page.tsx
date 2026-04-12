import { notFound } from "next/navigation";

import { Home, type HomeArticlePreview } from "@/components/home";
import { CONFIG_SITE } from "@lib/constant";
import { getPosts } from "@lib/get-post";
import { getSiteDictionary } from "@lib/i18n";
import { getSiteLocale } from "@lib/i18n";
import { isSiteLocale } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getLeafSlug } from "@lib/post-path";
import { getPageHref } from "@lib/post-path";
type Metadata = import("next").Metadata;
type BlogPage = import("@/types/blog").BlogPage;

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getSiteLocale(localeParam);
  const dictionary = getSiteDictionary(locale);

  return {
    title: dictionary.siteTitle,
    description: dictionary.siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        zh: "/zh",
      },
    },
    openGraph: {
      title: dictionary.siteTitle,
      description: dictionary.ogDescription,
      url: `/${locale}`,
      images: [
        {
          url: "/og_image_logo.webp",
        },
      ],
    },
    metadataBase: new URL(CONFIG_SITE.siteUrl),
  };
}

function toHomeArticlePreview(article: BlogPage, locale: "zh" | "en"): HomeArticlePreview {
  const slug = getLeafSlug(article);
  const title = getLocalizedTitle(article.data, locale) || slug || "Untitled";
  const href = getPageHref(article, locale) ?? "#";

  return {
    date: article.data.date ? new Date(article.data.date).toISOString() : null,
    href,
    key: href === "#" ? title : href,
    summary: article.data.summary ?? "",
    title,
  };
}

export default async function LocaleIndexPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const articles = (await getPosts()).map((article) => toHomeArticlePreview(article, locale));

  return <Home articles={articles} locale={locale} />;
}
