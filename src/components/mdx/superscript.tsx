import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Superscript: FC<ComponentProps<"sup">> = ({ className, ...props }) => (
  <sup className={cn("ml-0.5 align-super text-xs text-muted-foreground", className)} {...props} />
);
