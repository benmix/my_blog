import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Figcaption: FC<ComponentProps<"figcaption">> = ({ className, ...props }) => (
  <figcaption
    className={cn(
      "mt-3 max-w-[54ch] border-l border-border/80 pl-3 font-sans text-[0.82rem] leading-[1.66] text-muted-foreground",
      className,
    )}
    {...props}
  />
);
