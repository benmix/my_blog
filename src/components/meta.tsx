import type { FC, ReactNode } from "react";
import type { BlogMetadata } from "@/types";
import { GoBack, GoHome } from "@components/go-back";
import { format } from "date-fns";

export const Meta: FC<{ metadata: BlogMetadata } & { children?: ReactNode }> = ({
  metadata: { date, readingTime },
}) => {
  const readingTimeText = readingTime?.text;

  return (
    <div className="mb-8 flex">
      <div className="not-prose grow">
        <GoHome className="text-base-500" />
        <GoBack className="text-base-500" />
      </div>
      <div className="flex flex-wrap items-center gap-1 text-base-500">
        {format(date || "", "MMM d, y")}
        <span className="px-1">•</span>
        {readingTimeText}
      </div>
    </div>
  );
};
