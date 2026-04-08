import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";

import { MDXComponents } from "@components/mdx-components";
import { Wrapper } from "@components/mdx-wrapper";
import { CONFIG_SITE } from "@lib/constant";
import { blogSource } from "@lib/content-source";
import { getPosts } from "@lib/get-post";
import { getLocalizedTitle } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { resolvePostMetadataContext, resolvePostRoute } from "@lib/post-route";
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
  const page = await blogSource.getPage(slug);

  if (!page) {
    return {};
  }

  const metadataContext = resolvePostMetadataContext(localeParam, page);
  if (!metadataContext) {
    return {};
  }

  const { href, hrefEn, hrefZh, locale } = metadataContext;

  const { data: metadata } = page;
  const title = getLocalizedTitle(metadata, locale);
  const summary = metadata.summary ?? getPlainTextSummary(metadata.content ?? "");

  return {
    title: `${title} - ${getSiteDictionary(locale).siteTitle}`,
    description: summary,
    alternates: {
      canonical: href,
      languages: {
        ...(hrefEn ? { en: hrefEn } : {}),
        ...(hrefZh ? { zh: hrefZh } : {}),
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

  const { locale: localeParam, slug } = await Promise.resolve(params);

  const page = await blogSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const route = resolvePostRoute(localeParam, page);
  if (route.kind === "invalid-locale") {
    notFound();
  }

  const { data: metadata, toc } = page;

  return (
    <Wrapper currentPath={route.canonicalPath} locale={route.locale} metadata={metadata} toc={toc}>
      <MDXContent components={MDXComponents} code={page.data.mdx} />
    </Wrapper>
  );
};

export default Page;
