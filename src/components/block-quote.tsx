import type { FC, ReactNode } from "react";
import { cn } from "@lib/utils";

type CalloutType = "caution" | "important" | "note" | "tip" | "warning";

const TYPE_TO_CLASS: Record<CalloutType, string> = {
  note: "border-border bg-muted/50 text-foreground",
  tip: "border-primary/30 bg-primary/10 text-foreground",
  warning: "border-secondary/40 bg-secondary/60 text-foreground",
  important: "border-accent/40 bg-accent/40 text-foreground",
  caution: "border-destructive/40 bg-destructive/10 text-destructive-foreground",
};

type BlockquoteProps = {
  type?: CalloutType;
  children?: ReactNode;
};

export const Blockquote: FC<BlockquoteProps> = ({ type = "note", children, ...props }) => {
  return (
    <blockquote
      data-type={type}
      className={cn(
        "my-4 rounded-md border border-l-4 px-4 py-2 text-sm leading-relaxed shadow-sm",
        TYPE_TO_CLASS[type]
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
};
