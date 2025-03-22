import { Head } from "nextra/components";
import { FC, PropsWithChildren } from "react";
import { Layout, Content, Footer } from "@components/layout";
import "@/global.css";
import { ThemeSwitch } from "@components/theme-switch";
import { Link } from "@components/link";
import { RiGithubLine } from "@remixicon/react";
import { getYear } from "date-fns";
import type { Metadata } from "next";
import { CONFIG_SITE } from "@/lib/constant";

export const metadata: Metadata = {
  title: "benmix's blog",
  description: "share thoughts and life about me",
  icons: "/icon.svg",
  alternates: {
    types: {
      ["application/rss+xml"]: [
        {
          title: CONFIG_SITE.title,
          url: CONFIG_SITE.siteUrl + "/rss.xml",
        },
      ],
    },
  },
  openGraph: {
    title: CONFIG_SITE.title,
    description: "share thoughts and life about me",
    url: CONFIG_SITE.siteUrl,
    images: [
      {
        url: "/og_image.webp",
      },
    ],
  },
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="sitemap" href="/sitemap.xml" />
      </Head>
      <body>
        <Layout>
          <Content>{children}</Content>
          <Footer>
            <span className="text-gray-400 flex gap-1">
              <span>{`© ${getYear(new Date())} BenMix`}</span>
              <span>·</span>
              <Link href="/rss.xml" className="text-gray-400">
                RSS
              </Link>
              <span>·</span>
              <Link
                href="https://github.com/benmix"
                target="_blank"
                className="text-gray-400 inline-flex gap-1"
              >
                <RiGithubLine size="16" /> Github
              </Link>
            </span>
            <ThemeSwitch />
          </Footer>
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
