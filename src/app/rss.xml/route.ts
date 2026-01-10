import { CONFIG_SITE } from "@/lib/constant";
import { getPosts } from "@lib/get-post";
import { format, toDate } from "date-fns";

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
        const slug = post.slugs?.[post.slugs.length - 1];
        const title = (post.data.title ?? post.data.title_en ?? "").replace(/&/g, "&amp;");
        const href = `${CONFIG_SITE.siteUrl}${post.url ?? (slug ? `/posts/${slug}` : "")}`;
        const formattedDate = post.data.date ? format(toDate(post.data.date), "MMM d, y") : "";

        return [
          `    <item>`,
          `      <title>${title}</title>`,
          `      <link>${href.replace(/&/g, "&amp;")}</link>`,
          `      <pubDate>${formattedDate}</pubDate>`,
          `    </item>`,
        ];
      })
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
