import type { ReactNode } from "react";

import { cn } from "@lib/utils";

export function PullQuote({
  attribution,
  children,
  className,
}: {
  attribution?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "mx-auto my-16 max-w-[31ch] border-y border-border/80 px-3 py-8 text-center",
        className,
      )}
    >
      <blockquote className="m-0 border-none p-0 font-serif text-[1.5rem] leading-[1.32] text-foreground italic md:text-[1.9rem]">
        <p className="m-0">{children}</p>
      </blockquote>
      {attribution ? (
        <figcaption className="mt-4 font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
