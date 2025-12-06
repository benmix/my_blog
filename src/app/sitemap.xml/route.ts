import { CONFIG_SITE } from "@/lib/constant";
import { getPosts } from "@lib/get-post";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const xmls = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${CONFIG_SITE.siteUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  sitemap.push(
    ...(posts.map((post) => ({
      url: `${CONFIG_SITE.siteUrl}${post.route}`.replace(/&/g, "&amp;"),
      lastModified: new Date(post.frontMatter.date).toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    })) as MetadataRoute.Sitemap)
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
      .flat()
  );

  xmls.push(...["</urlset>"]);

  const xml = xmls.join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
