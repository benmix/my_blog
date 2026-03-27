import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Blockquote: FC<ComponentProps<"blockquote">> = ({ className, ...props }) => (
  <blockquote
    className={cn(
      "relative my-10 border-y border-foreground px-8 py-8 text-center font-serif text-2xl text-foreground italic [&_p]:mb-0",
      className,
    )}
    {...props}
  />
);
