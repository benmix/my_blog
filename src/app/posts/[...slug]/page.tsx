import { notFound, redirect } from "next/navigation";

import { blogSource } from "@lib/content-source";
import { getPosts } from "@lib/get-post";
import { DEFAULT_LOCALE } from "@lib/i18n";
import { resolveLegacyPostRedirect } from "@lib/post-route";

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
  const page = await blogSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const canonicalPath = resolveLegacyPostRedirect(page, DEFAULT_LOCALE);
  if (!canonicalPath) {
    notFound();
  }

  redirect(canonicalPath);
}
