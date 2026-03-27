import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Keyboard: FC<ComponentProps<"kbd">> = ({ className, ...props }) => (
  <kbd
    className={cn(
      "mx-0.5 rounded-md border border-border bg-card px-2 py-1 font-sans text-sm font-medium text-foreground shadow-sm",
      className,
    )}
    {...props}
  />
);
