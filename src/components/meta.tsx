import type { FC, ReactNode } from "react";
import { format, toDate } from "date-fns";
import type { BlogFrontmatter } from "@/types";
import { GoBackHome } from "@components/go-back";

export const Meta: FC<{ metadata: BlogFrontmatter } & { children?: ReactNode }> = ({
  metadata: { date, readingTime },
}) => {
  const readingTimeText = readingTime?.text;
  const normalizedDate = date ? toDate(date) : null;

  return (
    <div className="mb-8 flex">
      <div className="not-prose grow">
        <GoBackHome className="text-muted-foreground hover:text-foreground" />
      </div>
      <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {normalizedDate ? format(normalizedDate, "MMM d, y") : null}
        {normalizedDate && readingTimeText ? <span className="px-1">•</span> : null}
        {readingTimeText}
      </div>
    </div>
  );
};
