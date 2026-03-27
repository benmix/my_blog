import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";
import { Link } from "@components/link";

export const H2: FC<ComponentProps<"h2">> = ({ children, className, id, ...props }) => (
  <h2
    id={id}
    className={cn(
      "group my-10 scroll-mt-24 border-b border-border pb-2 font-serif text-3xl leading-tight font-bold text-foreground md:text-4xl",
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
  </h2>
);
