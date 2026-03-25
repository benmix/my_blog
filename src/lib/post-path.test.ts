import { getPageHref, getPageSlugSegments } from "./post-path";
import assert from "node:assert/strict";
import test from "node:test";

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
