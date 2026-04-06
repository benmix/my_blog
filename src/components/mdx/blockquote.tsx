import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Blockquote: FC<ComponentProps<"blockquote">> = ({ className, ...props }) => (
  <blockquote
    className={cn(
      "my-10 max-w-[60ch] border-l border-border pl-6 font-serif text-[1.14rem] leading-[1.8] text-foreground italic md:text-[1.28rem] [&_p]:mb-4 [&_p]:max-w-none [&_p:last-child]:mb-0",
      className,
    )}
    {...props}
  />
);
