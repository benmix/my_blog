/* eslint typescript-sort-keys/interface: error */
import type { $NextraMetadata, ReadingTime } from "nextra";

export type BlogMetadata = $NextraMetadata & {
  date?: string;
  readingTime?: ReadingTime;
};
