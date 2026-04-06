import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Image: FC<ComponentProps<"img">> = ({ className, alt, ...props }) => (
  // oxlint-disable-next-line nextjs/no-img-element
  <img
    className={cn("my-8 h-auto w-full border-y border-border/80", className)}
    alt={alt}
    {...props}
  />
);
