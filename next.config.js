/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
