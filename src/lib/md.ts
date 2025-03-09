import { NotionToMarkdown } from "notion-to-md";
import { notionClient } from "./notion-client";
import { MdBlock } from "notion-to-md/build/types";

const notionToMDService = new NotionToMarkdown({
  notionClient,
  config: {
    parseChildPages: false, // default: parseChildPages
  },
});

export const getMarkdownBlocks = (notion_page_id: string) => {
  return notionToMDService.pageToMarkdown(notion_page_id);
};

export const toMarkdownString = (markdown_blocks: MdBlock[]) => {
  return notionToMDService.toMarkdownString(markdown_blocks);
};

export const pageToMarkdownString = async (notion_page_id: string) => {
  const blocks = await getMarkdownBlocks(notion_page_id);
  return toMarkdownString(blocks);
};
