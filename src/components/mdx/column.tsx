import type { ReactNode } from "react";

import { cn } from "@lib/utils";

type ColumnSpan = "prose" | "poetry" | "aside";

const columnSpanMap: Record<ColumnSpan, string> = {
  aside: "max-w-[30ch]",
  poetry: "max-w-[32ch]",
  prose: "max-w-[68ch]",
};

export function Column({
  children,
  className,
  span = "prose",
}: {
  children: ReactNode;
  className?: string;
  span?: ColumnSpan;
}) {
  return <div className={cn("min-w-0", columnSpanMap[span], className)}>{children}</div>;
}
