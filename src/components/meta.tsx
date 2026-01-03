import type { FC, ReactNode } from "react";
import type { BlogMetadata } from "@/types";
import { GoBackHome } from "@components/go-back";
import { format } from "date-fns";

export const Meta: FC<{ metadata: BlogMetadata } & { children?: ReactNode }> = ({
  metadata: { date, readingTime },
}) => {
  const readingTimeText = readingTime?.text;

  return (
    <div className="mb-8 flex">
      <div className="not-prose grow">
        <GoBackHome className="text-muted-foreground hover:text-foreground" />
      </div>
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {format(date || "", "MMM d, y")}
        <span className="px-1">•</span>
        {readingTimeText}
      </div>
    </div>
  );
};
