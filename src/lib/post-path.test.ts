import assert from "node:assert/strict";
import test from "node:test";

import { getPageHref, getPageSlugSegments } from "./post-path";

test("getPageSlugSegments preserves nested slugs", () => {
  assert.deepEqual(
    getPageSlugSegments({
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
    }),
    ["notes", "nested-post"],
  );
});

test("getPageSlugSegments falls back to source path when slugs are missing", () => {
  assert.deepEqual(
    getPageSlugSegments({
      slugs: [],
      source: "notes/nested-post.md",
    }),
    ["notes", "nested-post"],
  );
});

test("getPageHref builds nested post urls", () => {
  assert.equal(
    getPageHref({
      slugs: ["notes", "nested-post"],
      source: "notes/nested-post.md",
      url: undefined,
    }),
    "/posts/notes/nested-post",
  );
});

test("getPageHref prefixes locale when provided", () => {
  assert.equal(
    getPageHref(
      {
        slugs: ["notes", "nested-post"],
        source: "notes/nested-post.md",
        url: undefined,
      },
      "en",
    ),
    "/en/posts/notes/nested-post",
  );
});
