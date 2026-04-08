import { describe, expect, test } from "vitest";

import {
  resolveLegacyPostRedirect,
  resolvePostMetadataContext,
  resolvePostRoute,
} from "@lib/post-route";

const samplePage = {
  url: "/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
  slugs: ["《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record"],
  source: "《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record.md",
};

describe("resolvePostMetadataContext", () => {
  test("returns null for invalid locales", () => {
    expect(resolvePostMetadataContext("fr", samplePage)).toBeNull();
  });

  test("returns canonical localized hrefs for valid locales", () => {
    expect(resolvePostMetadataContext("zh", samplePage)).toEqual({
      href: "/zh/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
      hrefEn: "/en/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
      hrefZh: "/zh/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
      locale: "zh",
    });
  });
});

describe("resolvePostRoute", () => {
  test("marks invalid locales as invalid", () => {
    expect(resolvePostRoute("fr", ["test"], samplePage)).toEqual({
      kind: "invalid-locale",
    });
  });

  test("redirects encoded slugs to the canonical path", () => {
    expect(
      resolvePostRoute(
        "zh",
        ["%E3%80%8ANo_Rules_Rules__Netflix_and_the_Culture_of_Reinvention%E3%80%8BReading_Record"],
        samplePage,
      ),
    ).toEqual({
      kind: "redirect",
      locale: "zh",
      canonicalPath:
        "/zh/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
    });
  });

  test("renders canonical slugs without redirect", () => {
    expect(
      resolvePostRoute(
        "zh",
        ["《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record"],
        samplePage,
      ),
    ).toEqual({
      kind: "render",
      locale: "zh",
      canonicalPath:
        "/zh/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
    });
  });
});

describe("resolveLegacyPostRedirect", () => {
  test("returns the canonical localized post path", () => {
    expect(resolveLegacyPostRedirect(samplePage, "zh")).toBe(
      "/zh/posts/《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record",
    );
  });
});
