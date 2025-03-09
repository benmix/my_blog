import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/posts",
  defaultShowCopyCode: true,
  readingTime: true,
});

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
});
