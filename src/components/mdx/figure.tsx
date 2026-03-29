import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Figure: FC<ComponentProps<"figure">> = ({ className, ...props }) => (
  <figure
    className={cn(
      "m-0 my-14 max-w-[72ch] text-foreground [&_img]:block [&_img]:h-auto [&_img]:w-full",
      className,
    )}
    {...props}
  />
);
