import { SiteControls } from "@components/site-controls";
import { cn } from "@lib/utils";

type SiteControlsFooterProps = {
  className?: string;
  currentPath: string;
  copyrightClassName?: string;
  locale: import("@lib/i18n").SiteLocale;
};

export function SiteControlsFooter({
  className,
  copyrightClassName,
  currentPath,
  locale,
}: SiteControlsFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={cn(className)}>
      <SiteControls currentPath={currentPath} locale={locale} />
      <p
        className={cn(
          "mt-5 font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground",
          copyrightClassName,
        )}
      >
        © {currentYear} BenMix
      </p>
    </div>
  );
}
