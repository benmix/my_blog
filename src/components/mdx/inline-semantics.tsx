import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

export function Delete({ className, ...props }: ComponentProps<"del">) {
  return (
    <del className={cn("font-serif text-muted-foreground line-through", className)} {...props} />
  );
}

export function Emphasis({ className, ...props }: ComponentProps<"em">) {
  return <em className={cn("text-foreground italic", className)} {...props} />;
}

export function Strong({ className, ...props }: ComponentProps<"strong">) {
  return <strong className={cn("font-semibold text-foreground", className)} {...props} />;
}

export function Subscript({ className, ...props }: ComponentProps<"sub">) {
  return <sub className={cn("align-sub text-xs text-muted-foreground", className)} {...props} />;
}

export function Superscript({ className, ...props }: ComponentProps<"sup">) {
  return (
    <sup className={cn("ml-0.5 align-super text-xs text-muted-foreground", className)} {...props} />
  );
}
