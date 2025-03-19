"use client";

import type { ComponentProps, FC, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

export const CopyToClipboard: FC<ComponentProps<"button">> = (props) => {
  const [isCopied, setCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied]);

  const handleClick = async (event: MouseEvent) => {
    setCopied(true);
    const container = event.currentTarget.parentNode!.parentNode!;
    const content = container.querySelector("pre code")?.textContent || "";
    try {
      // container should be not inside a try/catch statement, otherwise react-compiler give an error
      await navigator.clipboard.writeText(content);
    } catch {
      console.error("Failed to copy!");
    }
  };

  const IconToUse = isCopied ? RiCheckLine : RiFileCopyLine;

  return (
    <Button
      onClick={handleClick}
      title="Copy code"
      variant="outline"
      {...props}
    >
      <IconToUse size="1em" />
    </Button>
  );
};
