import { LocaleSwitch } from "@components/locale-switch";
import { ThemeSwitch } from "@components/theme-switch";

type SiteControlsProps = {
  currentPath: string;
  locale: import("@lib/i18n").SiteLocale;
};

export function SiteControls({ currentPath, locale }: SiteControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <LocaleSwitch currentPath={currentPath} locale={locale} />
      <ThemeSwitch className="rounded-full px-0 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground" />
    </div>
  );
}
