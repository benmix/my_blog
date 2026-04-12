"use client";

import { format } from "date-fns";

import { HomePhotoWall } from "@components/home-photo-wall";
import { Link } from "@components/link";
import { SiteControls } from "@components/site-controls";
import { SiteLinks } from "@components/site-links";
import { getDateLocale } from "@lib/i18n";
import { getTitleStyle } from "@lib/title-style";
import { cn } from "@lib/utils";

type SiteLocale = import("@lib/i18n").SiteLocale;
export type HomeArticlePreview = {
  date: string | null;
  href: string;
  key: string;
  summary: string;
  title: string;
};

type HomeProps = {
  articles: HomeArticlePreview[];
  issueDate: string;
  locale: SiteLocale;
};

const HOME_COPY = {
  zh: {
    aboutText: "我的个人博客，写随笔、技术笔记和阅读记录。分享生活里那些值得慢慢看的部分。",
    socialTitle: "链接",
  },
  en: {
    aboutText:
      "A personal blog of essays, technical notes, and reading records, sharing the parts of life worth taking a slower look at.",
    socialTitle: "Links",
  },
} as const satisfies Record<
  SiteLocale,
  {
    aboutText: string;
    socialTitle: string;
  }
>;

function formatArticleDate(date: string | null, locale: SiteLocale) {
  if (!date) {
    return "";
  }

  return format(new Date(date), locale === "zh" ? "yyyy.MM.dd" : "MMM dd, yyyy", {
    locale: getDateLocale(locale),
  });
}

function HomeArticle({ article, locale }: { article: HomeArticlePreview; locale: SiteLocale }) {
  const formattedDate = formatArticleDate(article.date, locale);
  const titleStyle = getTitleStyle(article.title);

  return (
    <li className="border-t border-border/80 py-6 first:border-t-0 first:pt-0 last:pb-0 md:mr-[8ch]">
      <article className="grid gap-3 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-8">
        <div className="pt-1 font-mono text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase">
          <time dateTime={article.date ? new Date(article.date).toISOString() : undefined}>
            {formattedDate}
          </time>
        </div>
        <div className="min-w-0">
          <Link href={article.href} className="group block">
            <h3 className="w-full font-serif text-[1.12rem] leading-[1.22] text-foreground transition-colors duration-200 group-hover:text-muted-foreground md:text-[1.32rem]">
              <span style={titleStyle} className="block [text-wrap:balance]">
                {article.title}
              </span>
            </h3>
            {article.summary ? (
              <p className="mt-2 w-full font-sans text-[0.88rem] leading-[1.72] [text-wrap:pretty] text-muted-foreground/88">
                {article.summary}
              </p>
            ) : null}
          </Link>
        </div>
      </article>
    </li>
  );
}

function HomeSidebar({
  aboutText,
  issueDate,
  locale,
  socialTitle,
}: {
  aboutText: string;
  issueDate: string;
  locale: SiteLocale;
  socialTitle: string;
}) {
  return (
    <div className="xl:scroll-hidden min-w-0 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="border-b border-border/80 bg-background py-5 pt-0 xl:sticky xl:top-0 xl:z-10">
        <div className="font-mono text-[0.72rem] tracking-[0.08em] text-muted-foreground">
          {issueDate}
        </div>
      </div>

      <div className="border-b border-border/80 py-5">
        <p className="max-w-[28ch] text-[0.88rem] leading-[1.72] text-muted-foreground">
          {aboutText}
        </p>
      </div>

      <HomeSidebarFooter className="hidden lg:block" locale={locale} socialTitle={socialTitle} />
    </div>
  );
}

function HomeSidebarFooter({
  className,
  locale,
  socialTitle,
}: {
  className?: string;
  locale: SiteLocale;
  socialTitle: string;
}) {
  return (
    <div className={cn(className)}>
      <div className="border-b border-border/80 py-5">
        <div className="font-mono text-[0.72rem] tracking-[0.08em] text-muted-foreground">
          {socialTitle}
        </div>
        <div className="mt-4">
          <SiteLinks />
        </div>
      </div>

      <div className="border-b-0 py-5">
        <SiteControls currentPath={`/${locale}`} locale={locale} />
      </div>
    </div>
  );
}

function HomeArticleList({
  articles,
  locale,
}: {
  articles: HomeArticlePreview[];
  locale: SiteLocale;
}) {
  return (
    <div className="xl:scroll-hidden min-w-0 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="border-b-0 pt-0 pb-5">
        <ul className="flex flex-col">
          {articles.map((article) => (
            <HomeArticle key={article.key} article={article} locale={locale} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Home({ articles, issueDate, locale }: HomeProps) {
  const { aboutText, socialTitle } = HOME_COPY[locale];

  return (
    <div className="not-prose w-full bg-background text-foreground xl:h-dvh xl:overflow-hidden">
      <div className="flex w-full flex-col px-4 py-6 sm:px-5 md:px-6 md:py-8 lg:px-8 xl:h-full xl:overflow-hidden xl:px-10">
        <section className="grid gap-8 pt-6 md:gap-10 md:pt-8 lg:grid-cols-[18rem_minmax(0,1fr)] xl:min-h-0 xl:flex-1 xl:grid-cols-[18rem_minmax(0,1fr)_minmax(0,1fr)] xl:grid-rows-1 xl:gap-8">
          <HomeSidebar
            aboutText={aboutText}
            issueDate={issueDate}
            locale={locale}
            socialTitle={socialTitle}
          />
          <HomeArticleList articles={articles} locale={locale} />
          <HomeSidebarFooter className="lg:hidden" locale={locale} socialTitle={socialTitle} />
          <HomePhotoWall locale={locale} />
        </section>
      </div>
    </div>
  );
}
