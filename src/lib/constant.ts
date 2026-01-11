import {
  RiBlueskyLine,
  RiGithubLine,
  RiRssLine,
  RiTwitterXLine,
} from "@remixicon/react";

export const CONFIG_SITE = {
  title: "BenMix's Blog",
  siteUrl: "https://blog.benmix.com",
  description: "Latest blog posts",
  lang: "zh-cn",
  footerLinks: [
    {
      id: "rss",
      icon: RiRssLine,
      href: "/rss.xml",
      external: false,
    },
    {
      id: "github",
      icon: RiGithubLine,
      href: "https://github.com/benmix",
      external: true,
    },
    {
      id: "x",
      icon: RiTwitterXLine,
      href: "https://x.com/bendao_me",
      external: true,
    },
    {
      id: "bsky",
      icon: RiBlueskyLine,
      href: "https://bsky.app/profile/bendao.me",
      external: true,
    },
  ],
};
