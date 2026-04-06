import { Link } from "@components/link";
import { CONFIG_SITE } from "@lib/constant";

export function SiteLinks() {
  return (
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
  );
}
