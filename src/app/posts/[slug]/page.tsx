import { Wrapper } from "@/components/mdx-wrapper";
import { getPost, getPosts } from "@/lib/get-post";
import { importPage } from "nextra/pages";
import type { NextPage, Metadata, ResolvedMetadata } from "next";
import { CONFIG_SITE } from "@/lib/constant";

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles.map((article) => {
    const splits = article.route.split("/");
    return {
      slug: splits[splits.length - 1],
    };
  });
}

type PageProps = {
  params: Promise<{ slug: string; path: string }>;
  parent: ResolvedMetadata;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await importPage([slug]);
  const { metadata } = result;
  return {
    metadataBase: new URL(CONFIG_SITE.siteUrl + "/posts"),
    title: metadata.title,
    description: "...",
    openGraph: {
      title: metadata.title,
      description: "...",
      url: slug,
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
  const { slug } = await params;
  const result = await importPage([slug]);
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
