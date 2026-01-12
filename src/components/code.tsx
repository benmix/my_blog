import type { ComponentProps, FC } from "react";

import { cn } from "@lib/utils";

export const Code: FC<ComponentProps<"code">> = ({ children, className, ...props }) => {
  return (
    <code
      className={cn(
        "code-block [&_span]:text-(--shiki-light) dark:[&_span]:text-(--shiki-dark)",
        className,
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  );
};
