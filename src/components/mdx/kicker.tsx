import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function Kicker({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-3 font-mono text-[0.68rem] leading-none font-medium tracking-[0.24em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}
