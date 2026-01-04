import type { ComponentType } from "react";

export type TocItem = {
  id: string;
  title: string;
};

export type ReadingTime = {
  text: string;
};

export type BlogFrontmatter = {
  title?: string;
  title_en?: string;
  date?: string | Date;
  tags?: string[];
  readingTime?: ReadingTime;
};

export type BlogPage = {
  data: BlogFrontmatter;
  toc?: TocItem[];
  body?: ComponentType<any>;
  source?: string;
  slugs?: string[];
  url?: string;
};
