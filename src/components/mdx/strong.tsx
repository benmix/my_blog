import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Strong: FC<ComponentProps<"strong">> = ({ className, ...props }) => (
  <strong className={cn("font-serif font-bold text-foreground", className)} {...props} />
);
