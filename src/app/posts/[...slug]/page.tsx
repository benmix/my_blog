import { redirect } from "next/navigation";

import { getPosts } from "@lib/get-post";
import { DEFAULT_LOCALE } from "@lib/i18n";

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  const articles = await getPosts();

  return articles
    .map((article) => {
      return article.slugs?.length ? { slug: article.slugs } : null;
    })
    .filter((item): item is { slug: string[] } => Boolean(item));
}

export default async function LegacyPostPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/${DEFAULT_LOCALE}/posts/${slug.join("/")}`);
}
