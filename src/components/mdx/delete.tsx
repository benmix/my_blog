import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Delete: FC<ComponentProps<"del">> = ({ className, ...props }) => (
  <del className={cn("font-serif text-muted-foreground line-through", className)} {...props} />
);
