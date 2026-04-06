import type { ReactNode } from "react";

import { cn } from "@lib/utils";

export function Annotation({
  label = "Note",
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-8 max-w-[56ch] border-l border-border/80 pl-4 text-muted-foreground",
        className,
      )}
    >
      <span className="mb-2 block font-mono text-[0.7rem] tracking-[0.18em] uppercase">
        {label}
      </span>
      <div className="font-sans text-[0.92rem] leading-[1.72] [&_p]:mb-3 [&_p]:max-w-none [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
