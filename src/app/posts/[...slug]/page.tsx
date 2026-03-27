import type { Metadata, NextPage } from "next";
import { blogSource } from "@lib/content-source";
import { CONFIG_SITE } from "@lib/constant";
import { getPageHref } from "@lib/post-path";
import { getPlainTextSummary } from "@lib/utils";
import { getPosts } from "@lib/get-post";
import { MDXComponents } from "@components/mdx-components";
import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";
import { Wrapper } from "@components/mdx-wrapper";

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles
    .map((article) => {
      return article.slugs?.length ? { slug: article.slugs } : null;
    })
    .filter((item): item is { slug: string[] } => Boolean(item));
}

type PageParams = { slug: string[] };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const page = await blogSource.getPage(slug);

  if (!page) {
    return {};
  }

  const { data: metadata } = page;
  const summary = metadata.summary ?? getPlainTextSummary(metadata.content ?? "");

  return {
    title: `${metadata.chinese_name ?? metadata.english_name} - ${CONFIG_SITE.title}`,
    description: summary,
    openGraph: {
      title: metadata.chinese_name ?? metadata.english_name,
      description: summary,
      url: getPageHref(page) ?? `/posts/${slug.join("/")}`,
      images: [
        {
          url: "/og_image_logo.webp",
        },
      ],
    },
  };
}

const Page: NextPage<PageProps> = async function (props) {
  const { params } = props;

  const { slug } = await Promise.resolve(params);

  const page = await blogSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const { data: metadata } = page;

  return (
    <Wrapper metadata={metadata}>
      <MDXContent components={MDXComponents} code={page.data.mdx} {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
