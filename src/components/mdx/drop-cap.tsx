import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function DropCap({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-6 max-w-[68ch] font-serif text-[1.05rem] leading-[1.9] [text-wrap:pretty] text-foreground first-letter:float-left first-letter:mt-[0.08em] first-letter:mr-[0.12em] first-letter:font-serif first-letter:text-[4.3em] first-letter:leading-[0.8] first-letter:font-semibold",
        className,
      )}
      {...props}
    />
  );
}
