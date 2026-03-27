import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Subscript: FC<ComponentProps<"sub">> = ({ className, ...props }) => (
  <sub className={cn("align-sub text-xs text-muted-foreground", className)} {...props} />
);
