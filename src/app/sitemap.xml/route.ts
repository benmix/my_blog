import { CONFIG_SITE } from "@/lib/constant";
import { getPosts } from "@lib/get-post";
import { SITE_LOCALES } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";

type SitemapItem = {
  changeFrequency: "monthly";
  lastModified: string;
  priority: number;
  url: string;
};

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const xmls = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  const sitemap: SitemapItem[] = SITE_LOCALES.map((locale) => ({
    url: `${CONFIG_SITE.siteUrl}/${locale}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  sitemap.push(
    ...SITE_LOCALES.flatMap((locale) =>
      posts.map((post) => {
        const url = `${CONFIG_SITE.siteUrl}${getPageHref(post, locale) ?? ""}`.replace(
          /&/g,
          "&amp;",
        );
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

  xmls.push(
    ...sitemap
      .map((site) => [
        `    <url>`,
        `      <loc>${site.url}</loc>`,
        `      <changefreq>${site.changeFrequency}</changefreq>`,
        `      <lastmod>${site.lastModified}</lastmod>`,
        `      <priority>${site.priority}</priority>`,
        `    </url>`,
      ])
      .flat(),
  );

  xmls.push("</urlset>");

  const xml = xmls.join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
