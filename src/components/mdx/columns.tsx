import type { ReactNode } from "react";

import { cn } from "@lib/utils";

type ColumnsLayout = "equal" | "prose-aside" | "prose-poetry";

const layoutMap: Record<ColumnsLayout, string> = {
  equal: "md:grid-cols-2",
  "prose-aside": "md:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.9fr)]",
  "prose-poetry": "md:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.85fr)]",
};

export function Columns({
  children,
  className,
  layout = "equal",
}: {
  children: ReactNode;
  className?: string;
  layout?: ColumnsLayout;
}) {
  return (
    <section
      className={cn("my-12 grid grid-cols-1 gap-x-10 gap-y-8", layoutMap[layout], className)}
    >
      {children}
    </section>
  );
}
