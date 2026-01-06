import type { FC, ReactNode } from "react";
import { cn } from "@lib/utils";

type CalloutType = "caution" | "important" | "note" | "tip" | "warning";

const TYPE_TO_CLASS: Record<CalloutType, string> = {
  caution: "border-destructive/40 bg-destructive/5 text-destructive",
  important: "border-destructive/40 bg-destructive/5 text-destructive",
  note: "border-muted-foreground/20 bg-muted/50 text-foreground",
  tip: "border-emerald-300/60 bg-emerald-100/30 text-foreground",
  warning: "border-amber-300/60 bg-amber-100/30 text-foreground",
};

type BlockquoteProps = {
  type?: CalloutType;
  children?: ReactNode;
};

export const Blockquote: FC<BlockquoteProps> = ({ type = "note", children, ...props }) => {
  return (
    <blockquote
      className={cn(
        "my-4 rounded-md border px-4 py-2 text-sm leading-relaxed shadow-sm",
        TYPE_TO_CLASS[type]
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
};
