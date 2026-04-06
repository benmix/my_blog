import { format } from "date-fns";
import { notFound } from "next/navigation";

import { Home } from "@/components/home";
import { CONFIG_SITE } from "@lib/constant";
import { getPosts } from "@lib/get-post";
import { getDateLocale } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { getSiteLocale } from "@lib/i18n";
import { isSiteLocale } from "@lib/i18n";
type Metadata = import("next").Metadata;

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

export default async function LocaleIndexPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const articles = await getPosts();
  const issueDate = format(new Date(), "PPPP", { locale: getDateLocale(locale) });

  return <Home articles={articles} issueDate={issueDate} locale={locale} />;
}
