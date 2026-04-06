import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

type Tone = "inline" | "margin";

export function Aside({
  tone = "margin",
  className,
  ...props
}: ComponentProps<"aside"> & { tone?: Tone }) {
  return (
    <aside
      data-tone={tone}
      className={cn(
        "my-8 max-w-[33ch] border-l border-border/80 pl-4 font-sans text-[0.92rem] leading-[1.74] text-muted-foreground",
        tone === "margin" && "lg:ml-auto",
        className,
      )}
      {...props}
    />
  );
}
