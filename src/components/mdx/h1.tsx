import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";
import { Link } from "@components/link";

export const H1: FC<ComponentProps<"h1">> = ({ children, className, id, ...props }) => (
  <h1
    id={id}
    className={cn(
      "group mb-8 scroll-mt-24 font-serif text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl",
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
  </h1>
);
