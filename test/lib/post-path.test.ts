import { expect, test } from "vitest";

import {
  buildPageSlugIndex,
  getCanonicalSlugPath,
  getLeafSlug,
  getPageHref,
  getPageSlugSegments,
  getSlugKey,
  splitSlugPath,
} from "@lib/post-path";

test("getPageSlugSegments preserves nested slugs", () => {
  expect(
    getPageSlugSegments({
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
    }),
  ).toEqual(["notes", "nested-post"]);
});

test("getPageSlugSegments returns undefined when canonical slugs are missing", () => {
  expect(getPageSlugSegments({ slugs: [], source: "notes/nested-post.md" })).toBeUndefined();
});

test("splitSlugPath preserves canonical path segments", () => {
  expect(splitSlugPath("reading/no-rules-rules")).toEqual(["reading", "no-rules-rules"]);
});

test("getCanonicalSlugPath returns the full canonical slug path", () => {
  expect(
    getCanonicalSlugPath({
      slugs: ["reading", "nested-post"],
      source: "reading/nested-post.md",
    }),
  ).toBe("reading/nested-post");
});

test("getLeafSlug returns the canonical leaf slug", () => {
  expect(
    getLeafSlug({
      slugs: ["reading", "nested-post"],
      source: "reading/nested-post.md",
    }),
  ).toBe("nested-post");
});

test("getPageHref builds nested post urls", () => {
  expect(
    getPageHref({
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
      url: undefined,
    }),
  ).toBe("/posts/notes/nested-post");
});

test("getPageHref prefixes locale when provided", () => {
  expect(
    getPageHref(
      {
        slugs: ["notes", "nested-post"],
        source: "notes/nested-post.md",
        url: undefined,
      },
      "en",
    ),
  ).toBe("/en/posts/notes/nested-post");
});

test("getSlugKey joins canonical slug segments without normalization", () => {
  expect(getSlugKey(["reading", "no-rules-rules"])).toBe("reading/no-rules-rules");
});

test("buildPageSlugIndex matches canonical slug keys", () => {
  const pages = [
    {
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
    },
    {
      slugs: ["no-rules-rules-netflix-culture-of-reinvention-reading-record"],
      source: "《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record.md",
    },
  ];

  const index = buildPageSlugIndex(pages);

  expect(index.get(getSlugKey(["notes", "nested-post"]))).toBe(pages[0]);
  expect(
    index.get(getSlugKey(["no-rules-rules-netflix-culture-of-reinvention-reading-record"])),
  ).toBe(pages[1]);
});

test("buildPageSlugIndex throws when canonical slugs are duplicated", () => {
  expect(() =>
    buildPageSlugIndex([
      {
        slugs: ["duplicate-post"],
        source: "first.md",
      },
      {
        slugs: ["duplicate-post"],
        source: "second.md",
      },
    ]),
  ).toThrowError('Duplicate post slug "duplicate-post" found for "first.md" and "second.md"');
});

test("buildPageSlugIndex indexes multi-segment slug paths", () => {
  const pages = [
    {
      slugs: ["reading", "no-rules-rules"],
      source: "reading/no-rules-rules.md",
    },
  ];

  const index = buildPageSlugIndex(pages);

  expect(index.get(getSlugKey(["reading", "no-rules-rules"]))).toBe(pages[0]);
});
