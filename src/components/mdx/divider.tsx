import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

type DividerGlyph = "line" | "section" | "asterism";

export function Divider({
  className,
  glyph = "line",
  ...props
}: Omit<ComponentProps<"hr">, "children"> & { glyph?: DividerGlyph }) {
  if (glyph === "line") {
    return (
      <hr
        className={cn("mx-auto my-14 w-20 border-0 border-t border-border", className)}
        {...props}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "my-14 text-center font-serif text-[1.05rem] tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      {glyph === "section" ? "§" : "* * *"}
    </div>
  );
}
