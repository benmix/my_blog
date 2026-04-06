import { expect, test } from "vitest";

import { getSecureRel } from "@lib/link-rel";

test("getSecureRel leaves non-blank links untouched", () => {
  expect(getSecureRel()).toBeUndefined();
  expect(getSecureRel("_self", "author")).toBe("author");
});

test("getSecureRel appends noopener and noreferrer for blank targets", () => {
  expect(getSecureRel("_blank")).toBe("noopener noreferrer");
  expect(getSecureRel("_blank", "nofollow")).toBe("nofollow noopener noreferrer");
});
