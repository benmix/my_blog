import { expect, test } from "vitest";

import { toBlogPage } from "@lib/blog-page";

test("toBlogPage uses canonical slug path and url from frontmatter data", () => {
  const page = {
    url: "/posts/Legacy_File_Name",
    source: "Legacy_File_Name.md",
    slugs: ["Legacy_File_Name"],
    data: {
      slug: "reading/canonical-post",
      url: "/posts/reading/canonical-post",
      toc: [],
    },
  } as Parameters<typeof toBlogPage>[0];

  const blogPage = toBlogPage(page);

  expect(blogPage.slugs).toEqual(["reading", "canonical-post"]);
  expect(blogPage.url).toBe("/posts/reading/canonical-post");
});
