import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Figcaption: FC<ComponentProps<"figcaption">> = ({ className, ...props }) => (
  <figcaption
    className={cn(
      "mt-3 text-center font-serif text-sm leading-relaxed text-muted-foreground italic",
      className,
    )}
    {...props}
  />
);
