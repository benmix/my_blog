import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function MarginNote({ className, ...props }: ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "my-6 max-w-[34ch] border-l border-border/80 pl-4 font-sans text-[0.88rem] leading-[1.7] text-muted-foreground lg:float-right lg:clear-right lg:my-2 lg:mr-[-18rem] lg:ml-8 lg:w-[15rem] lg:max-w-none",
        className,
      )}
      {...props}
    />
  );
}
