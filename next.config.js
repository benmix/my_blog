import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/posts",
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,
});

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  output: "export",
  images: {
    unoptimized: true,
  },
});
