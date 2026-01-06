import { FC, PropsWithChildren } from "react";
import { Layout, Content, Footer } from "@components/layout";
import "@/global.css";
import { ThemeSwitch } from "@components/theme-switch";
import { Link } from "@components/link";
import { RiCopyrightLine } from "@remixicon/react";
import { getYear } from "date-fns";
import type { Metadata } from "next";
import { CONFIG_SITE } from "@lib/constant";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG_SITE.siteUrl),
  title: "benmix's blog",
  description: "share thoughts and life about me",
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
    description: "share thoughts and life about me",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body>
        <Layout>
          <Content>{children}</Content>
          <Footer>
            <div className="flex gap-1 font-light text-muted-foreground">
              {CONFIG_SITE.footerLinks.map((link, index) => {
                const Icon = link.icon;

                if (!Icon) return null;

                return (
                  <span key={link.id} className="inline-flex items-center gap-1">
                    {index > 0 ? <span>·</span> : null}
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className="inline-flex gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Icon size="16" />
                    </Link>
                  </span>
                );
              })}
              <span>·</span>
              <RiCopyrightLine size="16" />
              <span>{getYear(new Date())}</span>
              <span>BenMix</span>
            </div>
            <ThemeSwitch />
          </Footer>
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
