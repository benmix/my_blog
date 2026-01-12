import type { ComponentProps, FC, ReactNode } from "react";

import { cn } from "@lib/utils";

import { CopyToClipboard } from "./copy-to-clipboard";

export const classes = {
  border: cn("border border-border", "contrast-more:border-foreground"),
};

export type PreProps = ComponentProps<"pre"> & {
  "data-filename"?: string;
  "data-copy"?: "";
  icon?: ReactNode;
};

export const Pre: FC<PreProps> = ({
  children,
  className,
  "data-filename": filename,
  "data-copy": copy,
  icon,
  ...props
}) => {
  const shouldShowCopy = copy === "";

  const copyButton = shouldShowCopy ? (
    <CopyToClipboard className={filename ? "ms-auto text-sm" : ""} />
  ) : null;
  const iconNode =
    typeof icon === "string" ? (
      <span
        className="shrink-0 [&>svg]:block"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    ) : (
      (icon ?? null)
    );

  return (
    <div className="group relative not-first:mt-6">
      {shouldShowCopy ? (
        <div className="absolute top-3 right-3 z-10 opacity-0 transition group-hover:opacity-100">
          {copyButton}
        </div>
      ) : null}
      {filename ? (
        <div
          className={cn(
            "flex items-center gap-2 rounded-t-lg border-b-0 bg-muted/70 px-4 py-2 text-xs text-muted-foreground",
            classes.border,
          )}
        >
          {iconNode}
          <span className="truncate">{filename}</span>
        </div>
      ) : null}
      <pre
        className={cn(
          "not-prose relative overflow-x-auto bg-(--shiki-light-bg) p-4 text-[.9em] subpixel-antialiased ring-1 ring-border ring-inset contrast-more:ring-foreground contrast-more:contrast-150 dark:bg-(--shiki-dark-bg)",
          filename ? "rounded-b-lg" : "rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
};
