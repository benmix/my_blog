import { Link } from "@components/link";
import { getSiteDictionary } from "@lib/i18n";
import { getSiteLocale } from "@lib/i18n";

type Props = {
  params?: Promise<{
    locale?: string;
  }>;
};

export default async function LocalizedNotFound({ params }: Props) {
  const resolvedParams = params ? await params : undefined;
  const localeParam = resolvedParams?.locale;
  const locale = getSiteLocale(localeParam);
  const dictionary = getSiteDictionary(locale);

  return (
    <section className="not-prose mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">404</p>
      <h1 className="text-3xl font-medium text-foreground">
        {locale === "zh" ? "页面不存在" : "Page not found"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {locale === "zh"
          ? "你访问的页面不存在，或链接已经失效。"
          : "The page you requested does not exist, or the link is no longer valid."}
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        {locale === "zh" ? `返回${dictionary.home}` : "Back to home"}
      </Link>
    </section>
  );
}
