"use client";

import { format } from "date-fns";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

import { Image } from "@components/image";
import { Link } from "@components/link";
import { SiteControls } from "@components/site-controls";
import { SiteLinks } from "@components/site-links";
import { getDateLocale } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getLeafSlug } from "@lib/post-path";
import { getPageHref } from "@lib/post-path";
import { getTitleStyle } from "@lib/title-style";
import { cn } from "@lib/utils";

type BlogPage = import("@/types/blog").BlogPage;
type SiteLocale = import("@lib/i18n").SiteLocale;

type HomeProps = {
  articles: BlogPage[];
  issueDate: string;
  locale: SiteLocale;
};

type HomePhoto = {
  alt: Record<SiteLocale, string>;
  meta: Record<SiteLocale, string>;
  src: string;
};

const MAX_HOME_ARTICLES = 10;
const HalftoneDots = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.HalftoneDots),
  { ssr: false },
);

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

const HOME_PHOTOS = [
  {
    alt: {
      zh: "文昌，月亮湾海滩",
      en: "Wenchang, Moon Bay Beach",
    },
    meta: {
      zh: "文昌，月亮湾",
      en: "Wenchang, Moon Bay",
    },
    src: "/photos/wenchang.hainan.webp",
  },
  {
    alt: {
      zh: "杨浦，黄浦江边工业岸线与港口",
      en: "Yangpu, industrial waterfront and port along the Huangpu River",
    },
    meta: {
      zh: "杨浦，黄浦江",
      en: "Yangpu, Huangpu River",
    },
    src: "/photos/yangpu.shanghai.webp",
  },
] as const satisfies readonly HomePhoto[];

function getArticleSlug(article: BlogPage) {
  return getLeafSlug(article);
}

function getDisplayTitle(article: BlogPage, locale: SiteLocale) {
  const slug = getArticleSlug(article);
  return getLocalizedTitle(article.data, locale) || slug || "Untitled";
}

function getArticleKey(article: BlogPage, locale: SiteLocale) {
  return getPageHref(article, locale) ?? getDisplayTitle(article, locale);
}

function formatArticleDate(article: BlogPage, locale: SiteLocale) {
  if (!article.data.date) {
    return "";
  }

  return format(new Date(article.data.date), locale === "zh" ? "yyyy.MM.dd" : "MMM dd, yyyy", {
    locale: getDateLocale(locale),
  });
}

function HomePhotoShader({ src }: { src: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div aria-hidden="true" className="home-photo-newsprint absolute inset-0">
      <HalftoneDots
        image={src}
        contrast={0.52}
        originalColors={false}
        inverted={false}
        grid="hex"
        radius={0.92}
        size={0.17}
        scale={1.08}
        grainSize={0.62}
        type="gooey"
        fit="cover"
        grainMixer={0.28}
        grainOverlay={0.26}
        colorFront={isDark ? "#E8E3D7" : "#24211D"}
        colorBack="#00000000"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "rgb(26 28 31 / 0.96)" : "rgb(236 230 216 / 0.96)",
        }}
      />
    </div>
  );
}

function HomeArticle({ article, locale }: { article: BlogPage; locale: SiteLocale }) {
  const href = getPageHref(article, locale) ?? "#";
  const title = getDisplayTitle(article, locale);
  const summary = article.data.summary ?? "";
  const formattedDate = formatArticleDate(article, locale);
  const titleStyle = getTitleStyle(title);

  return (
    <li className="border-t border-border/80 py-6 first:border-t-0 first:pt-0 last:pb-0 md:mr-[8ch]">
      <article className="grid gap-3 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-8">
        <div className="pt-1 font-mono text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase">
          <time
            dateTime={article.data.date ? new Date(article.data.date).toISOString() : undefined}
          >
            {formattedDate}
          </time>
        </div>
        <div className="min-w-0">
          <Link href={href} className="group block">
            <h3 className="w-full font-serif text-[1.12rem] leading-[1.22] text-foreground transition-colors duration-200 group-hover:text-muted-foreground md:text-[1.32rem]">
              <span style={titleStyle} className="block [text-wrap:balance]">
                {title}
              </span>
            </h3>
            {summary ? (
              <p className="mt-2 w-full font-sans text-[0.88rem] leading-[1.72] [text-wrap:pretty] text-muted-foreground/88">
                {summary}
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

function HomeArticleList({ articles, locale }: { articles: BlogPage[]; locale: SiteLocale }) {
  return (
    <div className="xl:scroll-hidden min-w-0 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="border-b-0 pt-0 pb-5">
        <ul className="flex flex-col">
          {articles.map((article) => (
            <HomeArticle key={getArticleKey(article, locale)} article={article} locale={locale} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function HomePhotoItem({
  index,
  locale,
  photo,
}: {
  index: number;
  locale: SiteLocale;
  photo: HomePhoto;
}) {
  return (
    <article
      key={`${photo.src}-${index}`}
      className="border-b border-border/80 pb-8 last:border-b-0 last:pb-0"
    >
      <figure
        className={cn(
          "home-photo-card relative overflow-hidden border border-border/70 bg-muted/35",
          "aspect-video",
        )}
      >
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3.5rem), 28rem"
          wrapperClassName="home-photo-original absolute inset-0"
          imageClassName="object-cover object-center"
          priority={index < 2}
        />
        <HomePhotoShader src={photo.src} />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/92 via-background/48 to-transparent px-4 py-4">
          <p className="max-w-[34ch] text-[0.88rem] leading-[1.72] text-foreground/88">
            {photo.meta[locale]}
          </p>
        </figcaption>
      </figure>
    </article>
  );
}

function HomePhotoColumn({ locale }: { locale: SiteLocale }) {
  return (
    <div className="xl:scroll-hidden hidden min-w-0 xl:block xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="border-b-0 pt-0 pb-5">
        <div className="home-photo-showcase flex flex-col gap-8">
          {HOME_PHOTOS.map((photo, index) => (
            <HomePhotoItem
              key={`${photo.src}-${index}`}
              index={index}
              locale={locale}
              photo={photo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Home({ articles, issueDate, locale }: HomeProps) {
  const featuredArticles = articles.slice(0, MAX_HOME_ARTICLES);
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
          <HomeArticleList articles={featuredArticles} locale={locale} />
          <HomeSidebarFooter className="lg:hidden" locale={locale} socialTitle={socialTitle} />
          <HomePhotoColumn locale={locale} />
        </section>
      </div>
    </div>
  );
}
