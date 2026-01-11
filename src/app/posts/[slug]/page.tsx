import { MDXComponents } from "@components/mdx-components";
import { Wrapper } from "@components/mdx-wrapper";
import { MDXContent } from "@content-collections/mdx/react";
import { blogSource } from "@lib/content-source";
import { getPosts } from "@lib/get-post";
import { getPlainTextSummary } from "@lib/utils";
import type { Metadata, NextPage } from "next";

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles
    .map((article) => {
      const slug = article.slugs?.[article.slugs.length - 1];
      return slug ? { slug } : null;
    })
    .filter((item): item is { slug: string } => Boolean(item));
}

type PageParams = { slug: string };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const page = await blogSource.getPage([slug]);

  if (!page) {
    return {};
  }

  const { data: metadata } = page;
  const summary =
    metadata.summary ?? getPlainTextSummary(metadata.content ?? "");

  return {
    title: metadata.title,
    description: summary,
    openGraph: {
      title: metadata.title,
      description: summary,
      url: "/posts/" + slug,
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

  const page = await blogSource.getPage([slug]);

  if (!page) {
    return null;
  }

  const { data: metadata } = page;

  return (
    <Wrapper toc={page.toc} metadata={metadata}>
      <MDXContent
        components={MDXComponents}
        code={page.data.mdx}
        {...props}
        params={params}
      />
    </Wrapper>
  );
};

export default Page;
