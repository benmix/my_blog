import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function Subhead({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-8 max-w-[40ch] font-sans text-[1.02rem] leading-[1.82] [text-wrap:pretty] text-muted-foreground md:text-[1.18rem]",
        className,
      )}
      {...props}
    />
  );
}
