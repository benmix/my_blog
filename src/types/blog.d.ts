import { Page } from "fumadocs-core/source";
import type { Post } from "content-collections";

export type TocItem = {
  id: string;
  title: string;
};

export interface BlogPage extends Page<Post> {
  toc?: TocItem[];
  source?: string;
}
