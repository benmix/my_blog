import { expect, test } from "vitest";

import { escapeXml, formatRssDate, renderSitemapXml, type SitemapItem } from "@lib/feed";

test("escapeXml escapes reserved characters", () => {
  expect(escapeXml(`<tag attr="x">Tom & 'Jerry'</tag>`)).toBe(
    "&lt;tag attr=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/tag&gt;",
  );
});

test("formatRssDate returns a GMT RFC-style date", () => {
  expect(formatRssDate("2026-03-26T08:00:00.000Z")).toBe("Thu, 26 Mar 2026 08:00:00 GMT");
});

test("renderSitemapXml escapes reserved characters in loc urls", () => {
  const items: SitemapItem[] = [
    {
      url: `https://blog.benmix.com/zh/posts/A&B<test>"quote"'apostrophe'`,
      lastModified: "2026-04-09T00:00:00.000Z",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  expect(renderSitemapXml(items)).toContain(
    "<loc>https://blog.benmix.com/zh/posts/A&amp;B&lt;test&gt;&quot;quote&quot;&apos;apostrophe&apos;</loc>",
  );
});
