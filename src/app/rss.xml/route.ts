import { escapeXml, formatRssDate } from "@lib/feed";
import { CONFIG_SITE } from "@/lib/constant";
import { getPageHref } from "@lib/post-path";
import { getPlainTextSummary } from "@lib/utils";
import { getPosts } from "@lib/get-post";

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
      .map((post) => {
        const title = escapeXml(post.data.chinese_name ?? post.data.english_name ?? "");
        const href = `${CONFIG_SITE.siteUrl}${getPageHref(post) ?? ""}`;
        const formattedDate = post.data.date ? formatRssDate(post.data.date) : "";
        const summary = getPlainTextSummary(post.data.summary ?? post.data.content ?? "");

        return [
          `    <item>`,
          `      <title>${title}</title>`,
          `      <link>${escapeXml(href)}</link>`,
          `      <description>${escapeXml(summary)}</description>`,
          `      <pubDate>${formattedDate}</pubDate>`,
          `    </item>`,
        ];
      })
      .flat(),
  );

  xmls.push(`  </channel>`, "</rss>");

  const xml = xmls.join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
