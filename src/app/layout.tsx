import { Head } from "nextra/components";
import { FC, PropsWithChildren } from "react";
import { Layout, Content, Footer } from "@components/layout";
import "@/global.css";
import { ThemeSwitch } from "@components/theme-switch";
import { Link } from "@components/link";
import { RiGithubLine } from "@remixicon/react";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Layout>
          <Content>{children}</Content>
          <Footer>
            <span className="text-gray-400 flex gap-1">
              <span> © 2025 BenMix </span>
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
                <RiGithubLine size="14" /> Github
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
