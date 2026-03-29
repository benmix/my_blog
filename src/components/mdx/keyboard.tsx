import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Keyboard: FC<ComponentProps<"kbd">> = ({ className, ...props }) => (
  <kbd
    className={cn(
      "mx-0.5 rounded-[2px] border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[0.82em] font-medium tracking-[0.03em] text-foreground",
      className,
    )}
    {...props}
  />
);
