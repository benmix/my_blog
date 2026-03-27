import type { ComponentProps, FC } from "react";
import { cn } from "@lib/utils";

export const Code: FC<ComponentProps<"code">> = ({ children, className, ...props }) => {
  const isInlineCode = !className;

  return (
    <code
      className={cn(
        isInlineCode
          ? "rounded-[4px] bg-accent px-1.5 py-0.5 font-mono text-sm text-foreground"
          : "code-block block [&_span]:text-(--shiki-light) dark:[&_span]:text-(--shiki-dark)",
        className,
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  );
};
