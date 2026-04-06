import { expect, test } from "vitest";

import { escapeXml, formatRssDate } from "@lib/feed";

test("escapeXml escapes reserved characters", () => {
  expect(escapeXml(`<tag attr="x">Tom & 'Jerry'</tag>`)).toBe(
    "&lt;tag attr=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/tag&gt;",
  );
});

test("formatRssDate returns a GMT RFC-style date", () => {
  expect(formatRssDate("2026-03-26T08:00:00.000Z")).toBe("Thu, 26 Mar 2026 08:00:00 GMT");
});
