import type { ComponentProps, FC, ReactNode } from "react";
import { CopyToClipboard } from "./copy-to-clipboard";
import { cn } from "@lib/utils";

export const classes = {
  border: cn(
    "border border-gray-300 dark:border-neutral-700",
    "contrast-more:border-gray-900 contrast-more:dark:border-gray-50"
  ),
};

export type PreProps = ComponentProps<"pre"> & {
  "data-filename"?: string;
  "data-copy"?: "";
  "data-language"?: string;
  icon?: ReactNode;
};

export const Pre: FC<PreProps> = ({
  children,
  className,
  "data-filename": filename,
  "data-copy": copy,
  "data-language": _language,
  icon,
  ...props
}) => {
  const copyButton = copy === "" && (
    <CopyToClipboard className={filename ? "ms-auto text-sm" : ""} />
  );

  return (
    <div className="relative not-first:mt-6">
      {filename && (
        <div
          className={cn(
            "flex h-12 items-center gap-2 rounded-t-md border-b-0 bg-gray-100 px-4 text-xs text-gray-700 dark:bg-neutral-900 dark:text-gray-200",
            classes.border
          )}
        >
          {icon}
          <span className="truncate">{filename}</span>
          {copyButton}
        </div>
      )}
      <pre
        className={cn(
          "group not-prose overflow-x-auto bg-white py-4 text-[.9em] subpixel-antialiased ring-1 ring-gray-300 ring-inset contrast-more:ring-gray-900 contrast-more:contrast-150 dark:bg-black dark:ring-neutral-700 contrast-more:dark:ring-gray-50",
          filename ? "rounded-b-md" : "rounded-md",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute right-4 flex gap-1 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 focus-within:opacity-100",
            filename ? "top-14" : "top-2"
          )}
        >
          {!filename && copyButton}
        </div>
        {children}
      </pre>
    </div>
  );
};
