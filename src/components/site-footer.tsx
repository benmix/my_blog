import { CONFIG_SITE } from "@lib/constant";
import { getYear } from "date-fns";
import { Link } from "@components/link";
import { ThemeSwitch } from "@components/theme-switch";

export function SiteFooter() {
  const currentYear = getYear(new Date());

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col items-center justify-between gap-4 border-t-2 border-foreground px-6 pt-8 pb-10 text-sm text-muted-foreground sm:flex-row sm:px-12">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <div className="flex items-center gap-4">
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
                className="transition-colors hover:text-foreground"
              >
                <Icon size="18" />
              </Link>
            );
          })}
        </div>
        <div className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
          © {currentYear} BenMix&apos;s Gazette
        </div>
      </div>

      <ThemeSwitch className="rounded-full hover:bg-muted/60 hover:text-foreground dark:hover:bg-muted/30" />
    </div>
  );
}
