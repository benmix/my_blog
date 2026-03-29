import { CONFIG_SITE } from "@/lib/constant";
import { escapeXml } from "@lib/feed";
import { formatRssDate } from "@lib/feed";
import { getPosts } from "@lib/get-post";
import { DEFAULT_LOCALE } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";
import { getPlainTextSummary } from "@lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const dictionary = getSiteDictionary(DEFAULT_LOCALE);

  const xmls = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0">',
    `  <channel>`,
    `    <title> ${dictionary.siteTitle} </title>`,
    `    <link> ${CONFIG_SITE.siteUrl} </link>`,
    `    <description> ${dictionary.siteDescription} </description>`,
    `    <language> ${dictionary.htmlLang} </language>`,
  ];

  xmls.push(
    ...posts
      .map((post) => {
        const title = escapeXml(getLocalizedTitle(post.data, DEFAULT_LOCALE));
        const href = `${CONFIG_SITE.siteUrl}${getPageHref(post, DEFAULT_LOCALE) ?? ""}`;
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
