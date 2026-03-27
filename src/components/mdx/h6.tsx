import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";
import { Link } from "@components/link";

export const H6: FC<ComponentProps<"h6">> = ({ children, className, id, ...props }) => (
  <h6
    id={id}
    className={cn(
      "group mb-4 scroll-mt-24 font-serif text-sm leading-snug font-bold tracking-wider text-foreground text-muted-foreground uppercase",
      className,
    )}
    {...props}
  >
    {children}
    {id ? (
      <Link
        href={`#${id}`}
        aria-label={`Permalink for ${id}`}
        className="ml-3 align-middle font-mono text-xs text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
      >
        #
      </Link>
    ) : null}
  </h6>
);
