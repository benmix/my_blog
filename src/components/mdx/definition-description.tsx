import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const DefinitionDescription: FC<ComponentProps<"dd">> = ({ className, ...props }) => (
  <dd
    className={cn(
      "mt-1 ml-2 border-l-2 border-border pl-6 font-serif text-lg leading-relaxed text-muted-foreground",
      className,
    )}
    {...props}
  />
);
