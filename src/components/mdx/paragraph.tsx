import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

export const Paragraph: FC<ComponentProps<"p">> = ({ className, ...props }) => (
  <p
    className={cn(
      "mb-6 max-w-[68ch] font-sans text-[1.03rem] leading-[1.92] [text-wrap:pretty] text-foreground",
      className,
    )}
    {...props}
  />
);
