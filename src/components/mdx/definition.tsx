import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function DefinitionList({ className, ...props }: ComponentProps<"dl">) {
  return <dl className={cn("max-w-[64ch] space-y-6", className)} {...props} />;
}

export function DefinitionTerm({ className, ...props }: ComponentProps<"dt">) {
  return <dt className={cn("font-sans text-lg font-bold text-foreground", className)} {...props} />;
}

export function DefinitionDescription({ className, ...props }: ComponentProps<"dd">) {
  return (
    <dd
      className={cn(
        "mt-1 ml-2 border-l-2 border-border pl-6 font-serif text-lg leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
