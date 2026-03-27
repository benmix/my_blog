import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const HorizontalRule: FC<ComponentProps<"hr">> = ({ className, ...props }) => (
  <hr className={cn("my-16 border-t border-border", className)} {...props} />
);
