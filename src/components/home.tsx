import { format } from "date-fns";

import { Image } from "@components/image";
import { Link } from "@components/link";
import { SiteFooter } from "@components/site-footer";
import { getDateLocale } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getPageHref } from "@lib/post-path";
import { getPageSlugSegments } from "@lib/post-path";
import { getTitleStyle } from "@lib/title-style";

type HomeProps = {
  articles: import("@/types/blog").BlogPage[];
  locale: import("@lib/i18n").SiteLocale;
};

const MAX_HOME_ARTICLES = 10;
const FALLBACK_TITLE = "Untitled";
const monoClass = "[font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]";
const serifClass = "[font-family:Georgia,Cambria,'Times_New_Roman',Times,serif]";

function getArticleSlug(article: import("@/types/blog").BlogPage) {
  const slugs = getPageSlugSegments(article);
  return slugs ? slugs[slugs.length - 1] : undefined;
}

function getDisplayTitle(
  article: import("@/types/blog").BlogPage,
  locale: import("@lib/i18n").SiteLocale,
) {
  const slug = getArticleSlug(article);
  return getLocalizedTitle(article.data, locale) || slug || FALLBACK_TITLE;
}

function getArticleKey(
  article: import("@/types/blog").BlogPage,
  locale: import("@lib/i18n").SiteLocale,
) {
  return getPageHref(article, locale) ?? getDisplayTitle(article, locale);
}

function formatIssueDate(locale: import("@lib/i18n").SiteLocale) {
  return format(new Date(), "PPPP", { locale: getDateLocale(locale) });
}

function formatArticleDate(
  article: import("@/types/blog").BlogPage,
  locale: import("@lib/i18n").SiteLocale,
) {
  if (!article.data.date) {
    return "";
  }

  return format(new Date(article.data.date), locale === "zh" ? "yyyy.MM.dd" : "MMM dd, yyyy", {
    locale: getDateLocale(locale),
  });
}

function HomeArticle({
  article,
  locale,
}: {
  article: import("@/types/blog").BlogPage;
  locale: import("@lib/i18n").SiteLocale;
}) {
  const href = getPageHref(article, locale) ?? "#";
  const title = getDisplayTitle(article, locale);
  const summary = article.data.summary ?? "";
  const formattedDate = formatArticleDate(article, locale);
  const titleStyle = getTitleStyle(title);

  return (
    <li className="border-t border-border/80 py-6 first:border-t-0 first:pt-0 last:pb-0">
      <article className="grid gap-3 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-8">
        <div
          className={`${monoClass} pt-1 text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase`}
        >
          <time
            dateTime={article.data.date ? new Date(article.data.date).toISOString() : undefined}
          >
            {formattedDate}
          </time>
        </div>
        <div className="min-w-0">
          <Link href={href} className="group block">
            <h2
              className={`${serifClass} max-w-[26ch] text-[1.35rem] leading-[1.15] text-foreground transition-colors duration-200 group-hover:text-muted-foreground md:text-[1.65rem]`}
            >
              <span style={titleStyle} className="block [text-wrap:balance]">
                {title}
              </span>
            </h2>
            {summary ? (
              <p className="mt-2 max-w-[58ch] font-sans text-[0.95rem] leading-[1.72] [text-wrap:pretty] text-muted-foreground/88">
                {summary}
              </p>
            ) : null}
          </Link>
        </div>
      </article>
    </li>
  );
}

export function Home({ articles, locale }: HomeProps) {
  const featuredArticles = articles.slice(0, MAX_HOME_ARTICLES);
  const issueDate = formatIssueDate(locale);

  return (
    <div className="not-prose w-full bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[82rem] flex-col px-6 py-8 sm:px-8 md:py-12 lg:px-10">
        <header className="mb-12 border-t-2 border-t-foreground py-8 md:py-10">
          <div className="w-full max-w-[calc(8.5rem+2rem+58ch)]">
            <div
              className={`${monoClass} mb-4 text-[0.8rem] tracking-[0.18em] text-muted-foreground uppercase`}
            >
              <span>{issueDate}</span>
            </div>
            <figure>
              <div className="relative aspect-[12/7] overflow-hidden border border-border/70 bg-muted/30 md:aspect-[15/8]">
                <div className="relative h-full w-full">
                  <Image
                    src="/home-background.webp"
                    livePhotoSrc="/home-background.mp4"
                    livePhotoType="video/mp4"
                    livePhotoAutoPlay
                    livePhotoMuted
                    livePhotoControls={false}
                    alt="Ocean View"
                    sizes="(max-width: 768px) 100vw, calc(8.5rem + 2rem + 58ch)"
                    wrapperClassName="absolute inset-0 group"
                    imageClassName="grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.01] group-hover:grayscale-0"
                    priority
                  />
                </div>
              </div>
            </figure>
          </div>
        </header>

        <section className="pb-10">
          <div className="pt-6 md:pt-8">
            <div className="min-w-0">
              <ul className="flex flex-col">
                {featuredArticles.map((article) => (
                  <HomeArticle
                    key={getArticleKey(article, locale)}
                    article={article}
                    locale={locale}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SiteFooter currentPath={`/${locale}`} locale={locale} />
      </div>
    </div>
  );
}
