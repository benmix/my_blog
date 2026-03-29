import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-8 max-w-[60ch] font-sans text-[1.14rem] leading-[1.88] [text-wrap:pretty] text-foreground md:text-[1.28rem]",
        className,
      )}
      {...props}
    />
  );
}
