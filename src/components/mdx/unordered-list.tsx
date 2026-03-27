import { type ComponentProps, type FC, type PropsWithChildren } from "react";
import { cn } from "@lib/utils";

export const UnorderedList: FC<PropsWithChildren<ComponentProps<"ul">>> = ({
  className,
  children,
  ...props
}) => {
  if (className?.includes("contains-task-list")) {
    return (
      <ul className={cn("m-0 list-none space-y-6 p-0", className)} {...props}>
        {children}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "mb-10 ml-5 list-outside list-disc space-y-3 font-serif text-lg text-foreground marker:text-muted-foreground [&_ul]:mt-2 [&_ul]:list-[circle] [&_ul]:space-y-2 [&_ul_ul]:list-[square]",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};
