import { type ComponentProps, type FC, type PropsWithChildren } from "react";
import { cn } from "@lib/utils";

export const OrderedList: FC<PropsWithChildren<ComponentProps<"ol">>> = ({
  className,
  children,
  ...props
}) => (
  <ol
    className={cn(
      "mb-10 ml-5 list-outside list-decimal space-y-3 font-serif text-lg text-foreground marker:font-sans marker:font-bold marker:text-foreground [&_ol]:mt-2 [&_ol]:space-y-2",
      className,
    )}
    {...props}
  >
    {children}
  </ol>
);
