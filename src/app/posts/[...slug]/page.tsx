type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@lib/i18n";

export default async function LegacyPostPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/${DEFAULT_LOCALE}/posts/${slug.join("/")}`);
}
