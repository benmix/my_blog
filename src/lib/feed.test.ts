import { escapeXml, formatRssDate } from "./feed";
import assert from "node:assert/strict";
import test from "node:test";

test("escapeXml escapes reserved characters", () => {
  assert.equal(
    escapeXml(`<tag attr="x">Tom & 'Jerry'</tag>`),
    "&lt;tag attr=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/tag&gt;",
  );
});

test("formatRssDate returns a GMT RFC-style date", () => {
  assert.equal(formatRssDate("2026-03-26T08:00:00.000Z"), "Thu, 26 Mar 2026 08:00:00 GMT");
});
