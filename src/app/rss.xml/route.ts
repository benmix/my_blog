import { CONFIG_SITE } from "@/lib/constant";
import { getPosts } from "@lib/get-post";
import { format } from "date-fns";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();

  const xmls = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0">',
    `  <channel>`,
    `    <title> ${CONFIG_SITE.title} </title>`,
    `    <link> ${CONFIG_SITE.siteUrl} </link>`,
    `    <description> ${CONFIG_SITE.description} </description>`,
    `    <language> ${CONFIG_SITE.lang} </language>`,
  ];

  xmls.push(
    ...posts
      .map((post) => [
        `    <item>`,
        `      <title>${post.frontMatter.title.replace(/&/g, "&amp;")}</title>`,
        `      <link>${CONFIG_SITE.siteUrl}${post.route.replace(/&/g, "&amp;")}</link>`,
        `      <pubDate>${format(post.frontMatter.date, "MMM d, y")}</pubDate>`,
        `    </item>`,
      ])
      .flat()
  );

  xmls.push(...[`  </channel>`, "</rss>"]);

  const xml = xmls.join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
