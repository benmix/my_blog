import type { HTMLAttributes } from "react";

import { cn } from "@lib/utils";

type SpaceSize = "s" | "m" | "l" | "xl";

const spaceMap: Record<SpaceSize, string> = {
  l: "h-14",
  m: "h-8",
  s: "h-4",
  xl: "h-24",
};

type SpaceProps = HTMLAttributes<HTMLDivElement> & { size?: SpaceSize };

function Space({ className, size = "m", ...props }: SpaceProps) {
  return <div aria-hidden="true" className={cn(spaceMap[size], className)} {...props} />;
}

export function Breath(props: SpaceProps) {
  return <Space {...props} />;
}

export function Silence(props: SpaceProps) {
  return <Space {...props} />;
}
