import { Link } from "@components/link";
import { getLocalizedPath } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { SITE_LOCALES } from "@lib/i18n";
import { cn } from "@lib/utils";

type LocaleSwitchProps = {
  className?: string;
  currentPath: string;
  locale: import("@lib/i18n").SiteLocale;
};

const localeLabelMap: Record<import("@lib/i18n").SiteLocale, string> = {
  en: "EN",
  zh: "中",
};

export function LocaleSwitch({ className, currentPath, locale }: LocaleSwitchProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <nav aria-label={dictionary.languageLabel} className={cn("flex items-center gap-2", className)}>
      {SITE_LOCALES.map((nextLocale) => {
        const isActive = nextLocale === locale;

        return (
          <Link
            key={nextLocale}
            href={getLocalizedPath(currentPath, nextLocale)}
            hrefLang={getSiteDictionary(nextLocale).htmlLang}
            className={cn(
              "font-mono text-[0.8rem] tracking-[0.15em] uppercase transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {localeLabelMap[nextLocale]}
          </Link>
        );
      })}
    </nav>
  );
}
