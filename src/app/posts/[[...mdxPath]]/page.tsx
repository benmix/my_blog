import { Wrapper } from "@/components/mdx-wrapper";
import { getPosts } from "@/lib/get-post";
import { importPage } from "nextra/pages";
import type { NextPage, Metadata } from "next";

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles.map((article) => {
    const splits = article.route.split("/");
    return {
      mdxPath: [splits[splits.length - 1]],
    };
  });
}

type PageProps = {
  params: Promise<{ mdxPath: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { mdxPath } = await params;
  const result = await importPage(mdxPath);
  const { metadata } = result;

  return {
    title: metadata.title,
  };
}

const Page: NextPage<PageProps> = async function (props) {
  const { params } = props;
  const { mdxPath } = await params;
  const result = await importPage(mdxPath);
  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
