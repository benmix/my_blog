import type { Metadata, NextPage } from "next";
import type { BlogPage } from "@/types";
import { Wrapper } from "@components/mdx-wrapper";
import { useMDXComponents } from "@/mdx-components";
import { blogSource } from "@lib/content-source";
import { getPosts } from "@lib/get-post";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const page = (await blogSource.getPage([slug])) as BlogPage;
  const metadata = page.data;
  return {
    title: metadata.title,
    description: "...",
    openGraph: {
      title: metadata.title,
      description: "...",
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
  const page = (await blogSource.getPage([slug])) as BlogPage;
  const { data: metadata } = page;
  const MDXContent = page.body ?? (page as any).default;
  const tocSource = (page.toc ?? (page as any).data?.toc) as
    | { id?: string; title?: string; value?: string }[]
    | undefined;
  const toc = tocSource
    ?.map((item) => ({
      id: item.id ?? "",
      title: item.title ?? item.value ?? "",
    }))
    .filter((item) => item.id && item.title);

  return (
    <Wrapper toc={toc} metadata={metadata}>
      {MDXContent ? (
        <MDXContent components={useMDXComponents()} {...props} params={params} />
      ) : null}
    </Wrapper>
  );
};

export default Page;
