import { getPageHref, getPageSlugSegments } from "@lib/post-path";
import type { BlogPage } from "@/types/blog";
import { format } from "date-fns";
import { getTitleStyle } from "@lib/title-style";
import { Image } from "@components/image";
import Link from "next/link";
import { SiteFooter } from "@components/site-footer";

type HomeProps = {
  articles: BlogPage[];
};

const MAX_HOME_ARTICLES = 10;
const FALLBACK_TITLE = "Untitled";
const HERO_CAPTION =
  "Figure 1. The serene ocean view that inspires deep thinking and creative writing.";
const monoClass = "[font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]";
const serifClass = "[font-family:Georgia,Cambria,'Times_New_Roman',Times,serif]";

function getArticleSlug(article: BlogPage) {
  const slugs = getPageSlugSegments(article);
  return slugs ? slugs[slugs.length - 1] : undefined;
}

function getDisplayTitle(article: BlogPage) {
  const slug = getArticleSlug(article);
  return article.data.chinese_name ?? article.data.english_name ?? slug ?? FALLBACK_TITLE;
}

function getArticleKey(article: BlogPage) {
  return getPageHref(article) ?? getDisplayTitle(article);
}

function formatIssueDate() {
  return format(new Date(), "EEEE, MMMM d, yyyy");
}

function formatArticleDate(article: BlogPage) {
  if (!article.data.date) {
    return "";
  }

  return format(new Date(article.data.date), "MMM dd, yyyy");
}

function HomeArticle({ article }: { article: BlogPage }) {
  const href = getPageHref(article) ?? "#";
  const title = getDisplayTitle(article);
  const summary = article.data.summary ?? "";
  const formattedDate = formatArticleDate(article);
  const titleStyle = getTitleStyle(title);

  return (
    <li className="border-b border-border pb-6 last:border-0">
      <Link
        href={href}
        className="group grid grid-cols-1 items-baseline gap-2 md:grid-cols-[1fr_auto] md:gap-8"
      >
        <h3
          className={`${serifClass} min-w-0 text-base leading-relaxed text-foreground transition-colors duration-200 group-hover:text-muted-foreground md:max-w-[34rem]`}
        >
          <span className="relative inline-block max-w-full pb-1 align-bottom after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.86,0,0.07,1)] group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
            <span style={titleStyle} className="block truncate">
              {title}
            </span>
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <span className="hidden h-px w-8 bg-border md:block" />
          <time className={`${monoClass} text-xs whitespace-nowrap text-muted-foreground`}>
            {formattedDate}
          </time>
        </div>
      </Link>
      {summary ? (
        <p className="mt-2 [display:-webkit-box] overflow-hidden text-sm text-muted-foreground [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {summary}
        </p>
      ) : null}
    </li>
  );
}

export function Home({ articles }: HomeProps) {
  const featuredArticles = articles.slice(0, MAX_HOME_ARTICLES);
  const issueDate = formatIssueDate();

  return (
    <div className="not-prose w-full bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-225 flex-col px-6 py-8 sm:px-12 md:py-12">
        <header className="mb-8">
          <div className="mb-8 border-t-[3px] border-b border-foreground border-b-border py-6">
            <div
              className={`${monoClass} flex items-center justify-between text-xs text-muted-foreground`}
            >
              <span>{issueDate}</span>
            </div>
          </div>

          <div className="relative aspect-[21/9] overflow-hidden border-2 border-border bg-muted p-1 shadow-[0_16px_32px_-24px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_32px_-24px_rgba(0,0,0,0.32)]">
            <Image
              src="/home-background.webp"
              livePhotoSrc="/home-background.mp4"
              livePhotoType="video/mp4"
              livePhotoAutoPlay
              livePhotoMuted
              livePhotoControls={false}
              alt="Ocean View"
              sizes="(max-width: 900px) 100vw, 900px"
              wrapperClassName="group absolute inset-0"
              imageClassName="grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.01] group-hover:grayscale-0"
              priority
            />
          </div>
          <p className={`${monoClass} mt-3 mb-10 text-center text-xs text-muted-foreground italic`}>
            {HERO_CAPTION}
          </p>
        </header>

        <section className="pb-10">
          <div className="mb-8 flex items-center gap-4 border-b-2 border-current pb-4">
            <h2
              className={`${serifClass} text-lg font-bold tracking-[0.16em] text-foreground uppercase`}
            >
              Latest Articles
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <ul className="flex flex-col space-y-8 md:space-y-10">
            {featuredArticles.map((article) => (
              <HomeArticle key={getArticleKey(article)} article={article} />
            ))}
          </ul>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
