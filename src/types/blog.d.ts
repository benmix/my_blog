import type { Post } from "content-collections";
import { Page } from "fumadocs-core/source";

export type TocItem = {
  id: string;
  title: string;
};

export interface BlogPage extends Page<Post> {
  toc?: TocItem[];
  source?: string;
}
