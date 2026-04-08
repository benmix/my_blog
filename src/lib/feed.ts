import { toDate } from "date-fns";

export type SitemapItem = {
  changeFrequency: "monthly";
  lastModified: string;
  priority: number;
  url: string;
};

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatRssDate(value: string | Date) {
  return toDate(value).toUTCString();
}

export function renderSitemapXml(items: SitemapItem[]) {
  const xmls = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...items
      .map((site) => [
        `    <url>`,
        `      <loc>${escapeXml(site.url)}</loc>`,
        `      <changefreq>${site.changeFrequency}</changefreq>`,
        `      <lastmod>${site.lastModified}</lastmod>`,
        `      <priority>${site.priority}</priority>`,
        `    </url>`,
      ])
      .flat(),
    "</urlset>",
  ];

  return xmls.join("\n");
}
