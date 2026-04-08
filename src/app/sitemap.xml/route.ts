import { CONFIG_SITE } from "@/lib/constant";
import { renderSitemapXml, type SitemapItem } from "@lib/feed";
import { getPosts } from "@lib/get-post";
import { SITE_LOCALES } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();

  const sitemap: SitemapItem[] = SITE_LOCALES.map((locale) => ({
    url: `${CONFIG_SITE.siteUrl}/${locale}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  sitemap.push(
    ...SITE_LOCALES.flatMap((locale) =>
      posts.map((post) => {
        const url = `${CONFIG_SITE.siteUrl}${getPageHref(post, locale) ?? ""}`;
        return {
          url,
          lastModified: post.data.date
            ? new Date(post.data.date).toISOString()
            : new Date().toISOString(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        } satisfies SitemapItem;
      }),
    ),
  );

  const xml = renderSitemapXml(sitemap);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
