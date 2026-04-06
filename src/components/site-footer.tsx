import { getYear } from "date-fns";

import { Link } from "@components/link";
import { LocaleSwitch } from "@components/locale-switch";
import { ThemeSwitch } from "@components/theme-switch";
import { CONFIG_SITE } from "@lib/constant";

type SiteFooterProps = {
  currentPath: string;
  locale: import("@lib/i18n").SiteLocale;
};

export function SiteFooter({ currentPath, locale }: SiteFooterProps) {
  const currentYear = getYear(new Date());

  return (
    <footer className="mt-16 w-full border-t border-foreground pt-8 text-[1rem] text-muted-foreground">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col flex-wrap items-center gap-6 md:flex-row">
          <div className="flex items-center gap-5">
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
                  aria-label={link.id}
                  title={link.id}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon size="18" />
                </Link>
              );
            })}
          </div>
          <div className="text-center text-[0.98rem] text-muted-foreground">
            © {currentYear} BenMix
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitch currentPath={currentPath} locale={locale} />
          <ThemeSwitch className="rounded-full text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground" />
        </div>
      </div>
    </footer>
  );
}
