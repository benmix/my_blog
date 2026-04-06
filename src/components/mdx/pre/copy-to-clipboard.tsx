"use client";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { useEffect, useState } from "react";

import { cn } from "@lib/utils";

export const CopyToClipboard: import("react").FC<import("react").ComponentProps<"button">> = ({
  className,
  ...props
}) => {
  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied]);

  const handleClick = async (event: import("react").MouseEvent) => {
    const container = event.currentTarget.closest("[data-code-block]");
    if (!container) {
      return;
    }

    const content = container.querySelector("pre code")?.textContent || "";
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      console.error("Failed to copy!");
    }
  };

  const IconToUse = isCopied ? RiCheckLine : RiFileCopyLine;

  return (
    <button
      aria-label={isCopied ? "Copied" : "Copy code"}
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border/40 bg-transparent px-2.5 font-mono text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors outline-none hover:border-border hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      onClick={handleClick}
      title="Copy code"
      type="button"
      {...props}
    >
      <span>{isCopied ? "Copied" : "Copy"}</span>
      <IconToUse aria-hidden="true" size="1em" />
    </button>
  );
};
