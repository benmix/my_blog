import assert from "node:assert/strict";
import { getSecureRel } from "./link-rel";
import test from "node:test";

test("getSecureRel leaves non-blank links untouched", () => {
  assert.equal(getSecureRel(), undefined);
  assert.equal(getSecureRel("_self", "author"), "author");
});

test("getSecureRel appends noopener and noreferrer for blank targets", () => {
  assert.equal(getSecureRel("_blank"), "noopener noreferrer");
  assert.equal(getSecureRel("_blank", "nofollow"), "nofollow noopener noreferrer");
});
