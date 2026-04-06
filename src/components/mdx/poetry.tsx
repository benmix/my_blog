import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function Poetry({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "my-12 max-w-[32ch] text-foreground [&_p]:max-w-none [&_p]:whitespace-pre-wrap",
        className,
      )}
      {...props}
    />
  );
}
