import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Figure: FC<ComponentProps<"figure">> = ({ className, ...props }) => (
  <figure className={cn("m-0 my-12 max-w-4xl", className)} {...props} />
);
