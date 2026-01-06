import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withContentCollections(nextConfig);
