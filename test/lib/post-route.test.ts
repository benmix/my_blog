import { describe, expect, test } from "vitest";

import {
  resolveLegacyPostRedirect,
  resolvePostMetadataContext,
  resolvePostRoute,
} from "@lib/post-route";

const samplePage = {
  url: "/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
  slugs: ["reading", "no-rules-rules-netflix-culture-of-reinvention-reading-record"],
  source: "《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record.md",
};

describe("resolvePostMetadataContext", () => {
  test("returns null for invalid locales", () => {
    expect(resolvePostMetadataContext("fr", samplePage)).toBeNull();
  });

  test("returns canonical localized hrefs for valid locales", () => {
    expect(resolvePostMetadataContext("zh", samplePage)).toEqual({
      href: "/zh/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
      hrefEn: "/en/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
      hrefZh: "/zh/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
      locale: "zh",
    });
  });
});

describe("resolvePostRoute", () => {
  test("marks invalid locales as invalid", () => {
    expect(resolvePostRoute("fr", samplePage)).toEqual({
      kind: "invalid-locale",
    });
  });

  test("renders canonical slugs without redirect", () => {
    expect(resolvePostRoute("zh", samplePage)).toEqual({
      kind: "render",
      locale: "zh",
      canonicalPath:
        "/zh/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
    });
  });
});

describe("resolveLegacyPostRedirect", () => {
  test("returns the canonical localized post path", () => {
    expect(resolveLegacyPostRedirect(samplePage, "zh")).toBe(
      "/zh/posts/reading/no-rules-rules-netflix-culture-of-reinvention-reading-record",
    );
  });
});
