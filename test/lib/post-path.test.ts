import { expect, test } from "vitest";

import {
  buildPageSlugIndex,
  getNormalizedSlugKey,
  getPageHref,
  getPageSlugSegments,
  hasCanonicalSlug,
  normalizeSlugSegments,
} from "@lib/post-path";

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

test("normalizeSlugSegments decodes encoded unicode slugs", () => {
  expect(
    normalizeSlugSegments([
      "%E3%80%8ANo_Rules_Rules__Netflix_and_the_Culture_of_Reinvention%E3%80%8BReading_Record",
    ]),
  ).toEqual(["《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record"]);
});

test("getNormalizedSlugKey normalizes and joins slug segments", () => {
  expect(
    getNormalizedSlugKey([
      "%E3%80%8ANo_Rules_Rules__Netflix_and_the_Culture_of_Reinvention%E3%80%8BReading_Record",
    ]),
  ).toBe("《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record");
});

test("hasCanonicalSlug accepts canonical unicode slugs", () => {
  expect(
    hasCanonicalSlug(["《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record"]),
  ).toBe(true);
});

test("hasCanonicalSlug rejects URL-encoded unicode slugs", () => {
  expect(
    hasCanonicalSlug([
      "%E3%80%8ANo_Rules_Rules__Netflix_and_the_Culture_of_Reinvention%E3%80%8BReading_Record",
    ]),
  ).toBe(false);
});

test("buildPageSlugIndex matches canonical and encoded unicode slugs", () => {
  const pages = [
    {
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
    },
    {
      slugs: ["《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record"],
      source: "《No_Rules_Rules__Netflix_and_the_Culture_of_Reinvention》Reading_Record.md",
    },
  ];

  const index = buildPageSlugIndex(pages);

  expect(index.get(getNormalizedSlugKey(["notes", "nested-post"]))).toBe(pages[0]);
  expect(
    index.get(
      getNormalizedSlugKey([
        "%E3%80%8ANo_Rules_Rules__Netflix_and_the_Culture_of_Reinvention%E3%80%8BReading_Record",
      ]),
    ),
  ).toBe(pages[1]);
});
