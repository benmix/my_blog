import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Mark: FC<ComponentProps<"mark">> = ({ className, ...props }) => (
  <mark
    className={cn("rounded-[2px] bg-border/60 px-1 py-0.5 font-serif text-foreground", className)}
    {...props}
  />
);
