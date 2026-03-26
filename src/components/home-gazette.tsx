import { getPageHref, getPageSlugSegments } from "@lib/post-path";
import type { BlogPage } from "@/types/blog";
import { format } from "date-fns";
import { Image } from "@components/image";
import Link from "next/link";

type HomeGazetteProps = {
  articles: BlogPage[];
};

const MAX_HOME_ARTICLES = 10;
const FALLBACK_TITLE = "Untitled";
const FALLBACK_LEAD_TITLE = "The Art of Continuous Learning";
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

function HomeGazetteArticle({ article }: { article: BlogPage }) {
  const href = getPageHref(article) ?? "#";
  const title = getDisplayTitle(article);
  const summary = article.data.summary ?? "";
  const formattedDate = formatArticleDate(article);

  return (
    <li className="border-b border-[#D4D4D4] pb-6 last:border-0 dark:border-[#4C433A]">
      <Link
        href={href}
        className="group grid grid-cols-1 items-baseline gap-2 md:grid-cols-[1fr_auto] md:gap-8"
      >
        <h3
          className={`${serifClass} text-base leading-relaxed text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#4A4A4A] dark:text-[#F3EEE4] dark:group-hover:text-[#C9C0B1]`}
        >
          <span className="relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.86,0,0.07,1)] group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
            {title}
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <span className="hidden h-px w-8 bg-[#D4D4D4] md:block dark:bg-[#4C433A]" />
          <time
            className={`${monoClass} text-xs whitespace-nowrap text-[#737373] dark:text-[#9E9382]`}
          >
            {formattedDate}
          </time>
        </div>
      </Link>
      {summary ? (
        <p className="mt-2 [display:-webkit-box] overflow-hidden text-sm text-[#4A4A4A] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] dark:text-[#C9C0B1]">
          {summary}
        </p>
      ) : null}
    </li>
  );
}

export function HomeGazette({ articles }: HomeGazetteProps) {
  const featuredArticles = articles.slice(0, MAX_HOME_ARTICLES);
  const leadArticle = featuredArticles[0];
  const issueDate = formatIssueDate();

  return (
    <div className="not-prose w-full bg-[#FDFCFA] text-[#1A1A1A] dark:bg-[#161412] dark:text-[#F3EEE4]">
      <div className="mx-auto w-full max-w-[900px] px-6 pt-8 sm:px-12">
        <header className="mb-8">
          <div className="mb-8 border-t-[3px] border-b border-t-[#1A1A1A] border-b-[#D4D4D4] py-6 text-center dark:border-t-[#F3EEE4] dark:border-b-[#4C433A]">
            <div
              className={`${monoClass} mb-4 flex items-center justify-center gap-4 text-xs tracking-[0.24em] text-[#737373] uppercase dark:text-[#9E9382]`}
            >
              <span>Vol. 1</span>
              <span className="size-1 rounded-full bg-current" />
              <span>Since 2022</span>
              <span className="size-1 rounded-full bg-current" />
              <span>Technology &amp; Life</span>
            </div>
            <h1
              className={`${serifClass} text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl lg:text-6xl dark:text-[#F3EEE4]`}
            >
              BenMix&apos;s Gazette
            </h1>
            <div className="mt-6 mb-4 h-px bg-[linear-gradient(to_right,transparent,#D4D4D4,transparent)] dark:bg-[linear-gradient(to_right,transparent,#4C433A,transparent)]" />
            <div
              className={`${monoClass} flex items-center justify-between text-xs text-[#737373] dark:text-[#9E9382]`}
            >
              <span>{issueDate}</span>
              <span>{leadArticle ? getDisplayTitle(leadArticle) : FALLBACK_LEAD_TITLE}</span>
            </div>
          </div>

          <div className="relative aspect-[21/9] overflow-hidden border-2 border-[#D4D4D4] bg-[#F2F2F2] p-1 shadow-[0_16px_32px_-24px_rgba(0,0,0,0.08)] dark:border-[#4C433A] dark:bg-[#1D1A18] dark:shadow-[0_16px_32px_-24px_rgba(0,0,0,0.32)]">
            <Image
              src="/home-background.webp"
              alt="Ocean View"
              sizes="(max-width: 900px) 100vw, 900px"
              wrapperClassName="group absolute inset-0"
              imageClassName="grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.01] group-hover:grayscale-0"
              priority
            />
          </div>
          <p
            className={`${monoClass} mt-3 mb-10 text-center text-xs text-[#737373] italic dark:text-[#9E9382]`}
          >
            {HERO_CAPTION}
          </p>
        </header>

        <section className="pb-10">
          <div className="mb-8 flex items-center gap-4 border-b-2 border-current pb-4">
            <h2
              className={`${serifClass} text-lg font-bold tracking-[0.16em] text-[#1A1A1A] uppercase dark:text-[#F3EEE4]`}
            >
              Latest Articles
            </h2>
            <div className="h-px flex-1 bg-[#D4D4D4] dark:bg-[#4C433A]" />
            <span className={`${monoClass} text-xs text-[#737373] dark:text-[#9E9382]`}>
              {featuredArticles.length} Articles
            </span>
          </div>

          <ul className="flex flex-col space-y-8 md:space-y-10">
            {featuredArticles.map((article) => (
              <HomeGazetteArticle key={getArticleKey(article)} article={article} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
