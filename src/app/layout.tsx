import "@/styles/global.css";
import { Content, Footer, Layout } from "@components/layout";
import { FC, PropsWithChildren } from "react";
import { CONFIG_SITE } from "@lib/constant";
import type { Metadata } from "next";
import { SiteFooter } from "@components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG_SITE.siteUrl),
  title: CONFIG_SITE.title,
  description: CONFIG_SITE.description,
  icons: "/icon.svg",
  alternates: {
    types: {
      ["application/rss+xml"]: [
        {
          title: CONFIG_SITE.title,
          url: "/rss.xml",
        },
      ],
    },
  },
  openGraph: {
    title: CONFIG_SITE.title,
    description: CONFIG_SITE.ogDescription,
    url: "/",
    images: [
      {
        url: "/og_image_logo.webp",
      },
    ],
  },
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang={CONFIG_SITE.lang} suppressHydrationWarning>
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body>
        <Layout>
          <Content>{children}</Content>
          <Footer>
            <SiteFooter />
          </Footer>
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
