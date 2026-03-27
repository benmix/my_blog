import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const Paragraph: FC<ComponentProps<"p">> = ({ className, ...props }) => (
  <p
    className={cn(
      "mb-6 font-serif text-lg leading-[1.7] [text-wrap:pretty] text-foreground",
      className,
    )}
    {...props}
  />
);
