import { cn } from "@lib/utils";
import type { ComponentProps, FC } from "react";

export const Code: FC<ComponentProps<"code">> = ({ children, className, ...props }) => {
  return (
    <code
      className={cn(
        "code-block [&_span]:text-(--shiki-light) dark:[&_span]:text-(--shiki-dark)",
        className
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  );
};
