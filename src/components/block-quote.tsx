import type { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const blockquoteVariants = cva(
  "my-4 rounded-md border border-l-4 px-4 py-2 text-sm leading-relaxed text-muted-foreground shadow-sm",
  {
    variants: {
      type: {
        note: "border-border bg-muted/50",
        tip: "border-primary/30 bg-primary/10",
        warning: "border-secondary/40 bg-secondary/60",
        important: "border-accent/40 bg-accent/40",
        caution: "border-destructive/40 bg-destructive/10 text-destructive-foreground",
      },
    },
    defaultVariants: {
      type: "note",
    },
  }
);

type BlockquoteProps = VariantProps<typeof blockquoteVariants> & {
  children?: ReactNode;
};

export const Blockquote: FC<BlockquoteProps> = ({ type, children, ...props }) => {
  return (
    <blockquote data-type={type} className={cn(blockquoteVariants({ type }))} {...props}>
      {children}
    </blockquote>
  );
};
