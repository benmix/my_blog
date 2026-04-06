import { expect, test } from "vitest";

import { getPlainTextSummary } from "@lib/utils";

test("getPlainTextSummary strips common markdown syntax from summaries", () => {
  const input = `
# Heading

**Bold** and _italic_ summary with [a link](https://example.com).

- first item
- second item
`;

  expect(getPlainTextSummary(input, 500)).toBe(
    "Heading Bold and italic summary with . first item second item",
  );
});

test("getPlainTextSummary removes code blocks and inline code", () => {
  const input = `
Intro with \`inline code\`.

\`\`\`ts
const hidden = true;
\`\`\`

Ending text.
`;

  expect(getPlainTextSummary(input, 500)).toBe("Intro with . Ending text.");
});
