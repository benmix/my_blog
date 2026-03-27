import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Image: FC<ComponentProps<"img">> = ({ className, alt, ...props }) => (
  // oxlint-disable-next-line nextjs/no-img-element
  <img
    className={cn("my-10 h-auto w-full rounded-lg border border-border shadow-inner", className)}
    alt={alt}
    {...props}
  />
);
