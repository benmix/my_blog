import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const HorizontalRule: FC<ComponentProps<"hr">> = ({ className, ...props }) => (
  <hr className={cn("mx-auto my-14 w-20 border-0 border-t border-border", className)} {...props} />
);
