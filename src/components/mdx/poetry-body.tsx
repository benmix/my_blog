import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function PoetryBody({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "m-0 font-serif text-[1.06rem] leading-[1.95] tracking-[0.01em] [text-wrap:pretty] whitespace-pre-wrap text-foreground",
        className,
      )}
      {...props}
    />
  );
}
