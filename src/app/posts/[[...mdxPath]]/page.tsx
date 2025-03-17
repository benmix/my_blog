import { Wrapper } from "@/components/mdx-wrapper";
import { getPosts } from "@/lib/get-post";
import { NextPage } from "next";
import { importPage } from "nextra/pages";

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles.map((article) => {
    const splits = article.route.split("/");
    return {
      mdxPath: [encodeURI(splits[splits.length - 1])],
    };
  });
}

const Page: NextPage<{ params: Promise<{ mdxPath: string[] }> }> =
  async function (props) {
    const params = await props.params;
    const result = await importPage(params.mdxPath);
    const { default: MDXContent, toc, metadata } = result;
    return (
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    );
  };

export default Page;
