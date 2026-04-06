import "@/styles/global.css";
import { Content } from "@components/layout";
import { Layout } from "@components/layout";
import { CONFIG_SITE } from "@lib/constant";
import { getSiteDictionary } from "@lib/i18n";
import { getSiteLocale } from "@lib/i18n";
type Metadata = import("next").Metadata;
type PropsWithChildren = import("react").PropsWithChildren;
type RootLayoutProps = PropsWithChildren & {
  params?: Promise<{
    locale?: string;
  }>;
};

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

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = params ? await params : undefined;
  const locale = getSiteLocale(resolvedParams?.locale);
  const dictionary = getSiteDictionary(locale);

  return (
    <html lang={dictionary.htmlLang} suppressHydrationWarning>
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body>
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </body>
    </html>
  );
}
