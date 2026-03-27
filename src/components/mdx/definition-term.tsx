import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";

export const DefinitionTerm: FC<ComponentProps<"dt">> = ({ className, ...props }) => (
  <dt className={cn("font-sans text-lg font-bold text-foreground", className)} {...props} />
);
