import { format } from "date-fns";
import { getYear } from "date-fns";
import { toDate } from "date-fns";

import { LocaleSwitch } from "@/components/locale-switch";
import { TableOfContents } from "@/components/table-of-content";
import { Link } from "@components/link";
import { ThemeSwitch } from "@components/theme-switch";
import { CONFIG_SITE } from "@lib/constant";
import { formatReadingTime } from "@lib/i18n";
import { getDateLocale } from "@lib/i18n";
import { getLocalizedTitle } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { getTitleStyle } from "@lib/title-style";
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

function SidebarSection({
  children,
  className,
  withBorder = true,
}: {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}) {
  return (
    <div className={cn("py-5 first:pt-2", withBorder && "border-b border-border/80", className)}>
      {children}
    </div>
  );
}

function SidebarLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

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
  const titleStyle = heading ? getTitleStyle(heading) : undefined;
  const summary = metadata.summary?.trim();
  const currentYear = getYear(new Date());

  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-col bg-background text-foreground",
        isEmbedded
          ? "max-w-full py-0"
          : "min-h-screen max-w-none overflow-visible px-4 py-6 sm:px-5 md:px-6 md:py-8 lg:px-8 xl:px-10",
      )}
    >
      <div className="relative">
        {isEmbedded ? null : (
          <aside
            className="hidden xl:fixed xl:top-8 xl:left-8 xl:block xl:max-h-[calc(100vh-4rem)] xl:w-[13rem] xl:overflow-y-auto 2xl:left-10 2xl:w-[14rem]"
            data-sidebar-scroll
          >
            <SidebarSection>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <span>{dictionary.home}</span>
                <span>/</span>
                <span className="text-foreground">{dictionary.articles}</span>
              </Link>
            </SidebarSection>

            <SidebarSection>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 font-sans text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                    Published
                  </p>
                  <div className="font-sans text-[0.92rem] leading-[1.45] text-muted-foreground">
                    {normalizedDate
                      ? format(normalizedDate, locale === "zh" ? "yyyy.MM.dd" : "MMM dd, yyyy", {
                          locale: getDateLocale(locale),
                        })
                      : null}
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-sans text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                    Reading Time
                  </p>
                  <div className="font-sans text-[0.9rem] leading-[1.5] text-muted-foreground">
                    {readingTime}
                  </div>
                </div>
                {summary ? (
                  <div>
                    <p className="mb-2 font-sans text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                      Abstract
                    </p>
                    <p className="font-sans text-[0.86rem] leading-[1.8] text-muted-foreground/88">
                      {summary}
                    </p>
                  </div>
                ) : null}
              </div>
            </SidebarSection>

            <SidebarSection>
              <TableOfContents
                label={dictionary.inThisArticle}
                mode="desktop"
                toc={toc}
                className="hidden py-0 xl:block xl:max-h-none xl:overflow-visible xl:border-l-0 xl:pl-0"
              />
            </SidebarSection>

            <SidebarSection>
              <SidebarLabel>Links</SidebarLabel>
              <div className="flex flex-col gap-3">
                {CONFIG_SITE.footerLinks.map((link) => {
                  const Icon = link.icon;

                  if (!Icon) {
                    return null;
                  }

                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon size="16" />
                      <span className="font-mono text-[0.78rem]">{link.id}</span>
                    </Link>
                  );
                })}
              </div>
            </SidebarSection>

            <SidebarSection withBorder={false}>
              <div className="flex items-center gap-4">
                <LocaleSwitch currentPath={currentPath} locale={locale} />
                <ThemeSwitch className="rounded-full px-0 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground" />
              </div>
              <p className="mt-5 font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground">
                © {currentYear} BenMix
              </p>
            </SidebarSection>
          </aside>
        )}

        <section className="mx-auto w-full max-w-[52rem] lg:max-w-[56rem] xl:max-w-[46rem] 2xl:max-w-[56rem]">
          <header
            className={cn(
              "mb-12 border-b border-border/80 pb-8 md:mb-14",
              isEmbedded ? "pt-0" : "pt-2",
            )}
          >
            <h1
              style={titleStyle}
              className="w-full font-serif text-[1.24rem] leading-[1.18] font-semibold text-foreground md:text-[1.48rem]"
            >
              <span className="block [text-wrap:balance]">{heading}</span>
            </h1>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 xl:hidden">
              <div>
                <p className="mb-1 font-sans text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                  Published
                </p>
                <p className="font-sans text-[0.9rem] leading-[1.45] text-muted-foreground">
                  {normalizedDate
                    ? format(normalizedDate, locale === "zh" ? "yyyy.MM.dd" : "MMM dd, yyyy", {
                        locale: getDateLocale(locale),
                      })
                    : null}
                </p>
              </div>
              <div>
                <p className="mb-1 font-sans text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                  Reading Time
                </p>
                <p className="font-sans text-[0.9rem] leading-[1.45] text-muted-foreground">
                  {readingTime}
                </p>
              </div>
            </div>
          </header>

          <article className="w-full text-foreground antialiased [&_pre]:max-w-none">
            <div className="w-full">{children}</div>
          </article>

          {isEmbedded ? null : (
            <footer className="mt-16 border-t border-border/80 pt-6 xl:hidden">
              <div className="space-y-6">
                <div>
                  <SidebarLabel>Links</SidebarLabel>
                  <div className="flex flex-col gap-3">
                    {CONFIG_SITE.footerLinks.map((link) => {
                      const Icon = link.icon;

                      if (!Icon) {
                        return null;
                      }

                      return (
                        <Link
                          key={link.id}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Icon size="16" />
                          <span className="font-mono text-[0.78rem]">{link.id}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4">
                    <LocaleSwitch currentPath={currentPath} locale={locale} />
                    <ThemeSwitch className="rounded-full px-0 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground" />
                  </div>
                  <p className="mt-5 font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground">
                    © {currentYear} BenMix
                  </p>
                </div>
              </div>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
};
