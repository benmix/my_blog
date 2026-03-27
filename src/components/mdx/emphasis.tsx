import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Emphasis: FC<ComponentProps<"em">> = ({ className, ...props }) => (
  <em className={cn("font-serif text-foreground italic", className)} {...props} />
);
