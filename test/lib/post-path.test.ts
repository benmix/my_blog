import { expect, test } from "vitest";

import { getPageHref, getPageSlugSegments } from "@lib/post-path";

test("getPageSlugSegments preserves nested slugs", () => {
  expect(
    getPageSlugSegments({
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
    }),
  ).toEqual(["notes", "nested-post"]);
});

test("getPageSlugSegments falls back to source path when slugs are missing", () => {
  expect(
    getPageSlugSegments({
      slugs: [],
      source: "notes/nested-post.md",
    }),
  ).toEqual(["notes", "nested-post"]);
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
