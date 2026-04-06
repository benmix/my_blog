import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";

import { MDXComponents } from "@components/mdx-components";
import { Wrapper } from "@components/mdx-wrapper";
import { CONFIG_SITE } from "@lib/constant";
import { blogSource } from "@lib/content-source";
import { getPosts } from "@lib/get-post";
import { getLocalizedTitle } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { getSiteLocale } from "@lib/i18n";
import { isSiteLocale } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";
import { getPlainTextSummary } from "@lib/utils";
type Metadata = import("next").Metadata;
type NextPage<T = object> = import("next").NextPage<T>;

export async function generateStaticParams() {
  const articles = await getPosts();

  return ["zh", "en"].flatMap((locale) =>
    articles
      .map((article) => {
        return article.slugs?.length ? { locale, slug: article.slugs } : null;
      })
      .filter((item): item is { locale: string; slug: string[] } => Boolean(item)),
  );
}

type PageParams = { locale: string; slug: string[] };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await Promise.resolve(params);
  const locale = getSiteLocale(localeParam);
  const page = await blogSource.getPage(slug);

  if (!page) {
    return {};
  }

  const { data: metadata } = page;
  const title = getLocalizedTitle(metadata, locale);
  const summary = metadata.summary ?? getPlainTextSummary(metadata.content ?? "");
  const href = getPageHref(page, locale) ?? `/${locale}/posts/${slug.join("/")}`;

  return {
    title: `${title} - ${getSiteDictionary(locale).siteTitle}`,
    description: summary,
    alternates: {
      canonical: href,
      languages: {
        en: getPageHref(page, "en") ?? `/en/posts/${slug.join("/")}`,
        zh: getPageHref(page, "zh") ?? `/zh/posts/${slug.join("/")}`,
      },
    },
    openGraph: {
      title,
      description: summary,
      url: href,
      images: [
        {
          url: "/og_image_logo.webp",
        },
      ],
    },
    metadataBase: new URL(CONFIG_SITE.siteUrl),
  };
}

const Page: NextPage<PageProps> = async function (props) {
  const { params } = props;

  const { locale, slug } = await Promise.resolve(params);

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const page = await blogSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const { data: metadata, toc } = page;

  return (
    <Wrapper
      currentPath={getPageHref(page, locale) ?? `/${locale}/posts/${slug.join("/")}`}
      locale={locale}
      metadata={metadata}
      toc={toc}
    >
      <MDXContent components={MDXComponents} code={page.data.mdx} />
    </Wrapper>
  );
};

export default Page;
