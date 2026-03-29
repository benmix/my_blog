import { format } from "date-fns";
import { toDate } from "date-fns";

import { LocaleSwitch } from "@/components/locale-switch";
import { TableOfContents } from "@/components/table-of-content";
import { Link } from "@components/link";
import { SiteFooter } from "@components/site-footer";
import { formatReadingTime } from "@lib/i18n";
import { getDateLocale } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { cn } from "@lib/utils";
type Post = import("content-collections").Post;
type ReactNode = import("react").ReactNode;

type WrapperProps = {
  children?: ReactNode;
  currentPath: string;
  locale: import("@lib/i18n").SiteLocale;
  metadata: Post;
  toc?: import("@/types/blog").TocItem[];
  variant?: "embedded" | "page";
};

export const Wrapper = ({
  children,
  currentPath,
  locale,
  metadata,
  toc,
  variant = "page",
}: WrapperProps) => {
  const dictionary = getSiteDictionary(locale);
  const heading = getLocalizedTitle(metadata, locale);
  const normalizedDate = metadata.date ? toDate(metadata.date) : null;
  const readingTime = formatReadingTime(metadata.reading_time?.text, locale);
  const isEmbedded = variant === "embedded";

  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-col bg-background text-foreground",
        isEmbedded
          ? "max-w-full py-0"
          : "min-h-screen max-w-[82rem] overflow-visible px-6 py-8 sm:px-8 md:py-12 lg:px-10",
      )}
    >
      {isEmbedded ? null : (
        <nav className="mb-10 flex items-center gap-2 font-mono text-[0.82rem] tracking-[0.18em] text-muted-foreground uppercase">
          <Link href={`/${locale}`} className="transition-colors hover:text-foreground">
            {dictionary.home}
          </Link>
          <span>/</span>
          <span className="text-foreground">{dictionary.articles}</span>
          <span className="ml-auto">
            <LocaleSwitch currentPath={currentPath} locale={locale} />
          </span>
        </nav>
      )}

      <header
        className={cn(
          "border-t-2 border-b border-border border-t-foreground",
          isEmbedded ? "mb-10 py-6 md:py-8" : "mb-12 py-8 md:py-10",
        )}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,68ch)_minmax(14rem,18rem)] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <h1 className="max-w-[12ch] font-serif text-[2.45rem] leading-[0.95] font-bold tracking-[-0.038em] text-balance text-foreground md:text-[3.8rem]">
              {heading}
            </h1>
          </div>
          <div className="flex shrink-0 flex-col gap-2 border-l border-border pl-5 font-mono text-[0.8rem] tracking-[0.15em] text-muted-foreground uppercase">
            <span>
              {normalizedDate
                ? format(normalizedDate, "PPPP", {
                    locale: getDateLocale(locale),
                  })
                : null}
            </span>
            <span>{readingTime}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,68ch)_minmax(14rem,18rem)] lg:items-start lg:gap-14">
        <div className="min-w-0">
          <TableOfContents label={dictionary.inThisArticle} mode="mobile" toc={toc} />
          <article className="text-foreground antialiased [&_pre]:max-w-[76ch]">{children}</article>
        </div>
        <TableOfContents label={dictionary.inThisArticle} mode="desktop" toc={toc} />
      </div>

      {isEmbedded ? null : <SiteFooter currentPath={currentPath} locale={locale} />}
    </main>
  );
};
