import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const DefinitionList: FC<ComponentProps<"dl">> = ({ className, ...props }) => (
  <dl className={cn("space-y-6", className)} {...props} />
);
