import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Mark: FC<ComponentProps<"mark">> = ({ className, ...props }) => (
  <mark
    className={cn("rounded bg-yellow-200 px-1.5 py-0.5 font-serif text-foreground", className)}
    {...props}
  />
);
