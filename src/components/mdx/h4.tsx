import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";
import { Link } from "@components/link";

export const H4: FC<ComponentProps<"h4">> = ({ children, className, id, ...props }) => (
  <h4
    id={id}
    className={cn(
      "group mb-5 scroll-mt-24 font-serif text-xl leading-snug font-medium text-foreground",
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
  </h4>
);
