import { RiTranslate2 } from "@remixicon/react";

import { Link } from "@components/link";
import { getLocalizedPath } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
import { cn } from "@lib/utils";

type LocaleSwitchProps = {
  className?: string;
  currentPath: string;
  locale: import("@lib/i18n").SiteLocale;
};

export function LocaleSwitch({ className, currentPath, locale }: LocaleSwitchProps) {
  const dictionary = getSiteDictionary(locale);
  const nextLocale = locale === "zh" ? "en" : "zh";
  const nextLocaleLabel = nextLocale === "zh" ? "中文" : "English";

  return (
    <nav aria-label={dictionary.languageLabel} className={cn("flex items-center", className)}>
      <Link
        href={getLocalizedPath(currentPath, nextLocale)}
        hrefLang={getSiteDictionary(nextLocale).htmlLang}
        aria-label={`Switch language to ${nextLocaleLabel}`}
        title={`Switch language to ${nextLocaleLabel}`}
        className="inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <RiTranslate2 size="16" />
      </Link>
    </nav>
  );
}
