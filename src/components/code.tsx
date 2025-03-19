import { cn } from "@/lib/utils";
import type { ComponentProps, FC } from "react";

export const Code: FC<
  ComponentProps<"code"> & {
    "data-language"?: string;
  }
> = ({ children, className, "data-language": _language, ...props }) => {
  return (
    <code
      className={cn(
        "code-block",
        "data-line-numbers" in props && "[counter-reset:line]",
        className,
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  );
};
