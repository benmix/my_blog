import { Link } from "@components/link";
import { getLocalizedPath } from "@lib/i18n";
import { getSiteDictionary } from "@lib/i18n";
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
  const nextLocale = locale === "zh" ? "en" : "zh";

  return (
    <nav aria-label={dictionary.languageLabel} className={cn("flex items-center", className)}>
      <Link
        href={getLocalizedPath(currentPath, nextLocale)}
        hrefLang={getSiteDictionary(nextLocale).htmlLang}
        className="font-mono text-[0.8rem] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        {localeLabelMap[nextLocale]}
      </Link>
    </nav>
  );
}
