import type { FC, ReactNode } from "react";
import type { BlogMetadata } from "../types";
import { GoBack } from "./go-back";
import { format } from "date-fns";

export const Meta: FC<
  { metadata: BlogMetadata } & { children?: ReactNode }
> = ({ metadata: { date, readingTime } }) => {
  const readingTimeText = readingTime?.text;

  return (
    <div className="mb-8 flex">
      <div className="grow not-prose">
        <GoBack className="text-gray-400" />
      </div>
      <div className="flex flex-wrap items-center gap-1 text-gray-400">
        {format(date || "", "MMM d, y")}
        <span className="px-1">•</span>
        {readingTimeText}
      </div>
    </div>
  );
};
