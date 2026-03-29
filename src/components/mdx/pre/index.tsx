import type { ComponentProps, FC, ReactNode } from "react";

import { cn } from "@lib/utils";

import { CopyToClipboard } from "./copy-to-clipboard";

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
  const label = filename ?? "code";

  const copyButton = shouldShowCopy ? (
    <CopyToClipboard className="ms-auto text-xs text-muted-foreground" />
  ) : null;

  return (
    <div
      className="group my-8 overflow-hidden rounded border border-border/80 font-sans [background:var(--shiki-light-bg)] dark:[background:var(--shiki-dark-bg)]"
      data-code-block=""
    >
      {filename || shouldShowCopy ? (
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          <span className="truncate">{`// ${label}`}</span>
          {shouldShowCopy ? copyButton : null}
        </div>
      ) : null}
      {icon ? (
        <div
          className="sr-only"
          aria-hidden="true"
          dangerouslySetInnerHTML={typeof icon === "string" ? { __html: icon } : undefined}
        >
          {typeof icon === "string" ? null : icon}
        </div>
      ) : null}
      <pre
        className={cn(
          "not-prose m-0 overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed [color:var(--shiki-light)] [background:var(--shiki-light-bg)] dark:[color:var(--shiki-dark)] dark:[background:var(--shiki-dark-bg)]",
          "[&_code]:grid [&_code]:min-w-full [&_code]:bg-transparent [&_code]:p-0",
          "[&_.line]:block [&_.line]:min-h-[1.75em]",
          "[&_code_span]:[font-weight:var(--shiki-light-font-weight,inherit)] [&_code_span]:[color:var(--shiki-light)]",
          "dark:[&_code_span]:[font-weight:var(--shiki-dark-font-weight,inherit)] dark:[&_code_span]:[color:var(--shiki-dark)]",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
};
