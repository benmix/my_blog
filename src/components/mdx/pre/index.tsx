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
      className="group my-8 rounded border border-border bg-accent p-6 font-sans"
      data-code-block=""
    >
      {filename || shouldShowCopy ? (
        <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          <span>{`// ${label}`}</span>
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
          "not-prose m-0 overflow-x-auto font-mono text-sm leading-relaxed text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
};
