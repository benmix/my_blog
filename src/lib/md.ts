import { NotionToMarkdown } from "notion-to-md";
import { notionClient } from "./notion-client";
import { MdBlock } from "notion-to-md/build/types";
import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { saveFile } from "./download";
import { randomUUID } from "node:crypto";

const notionToMDService = new NotionToMarkdown({
  notionClient,
  config: {
    parseChildPages: false, // default: parseChildPages
  },
});

notionToMDService.setCustomTransformer("image", async (block) => {
  const { image } = block as ImageBlockObjectResponse;
  let url = "";

  if (image.type == "file") {
    url = image.file.url;
  } else if (image.type === "external") {
    url = image.external.url;
  }

  const name = image.caption[0]?.plain_text.replace(/[\s\/\(\)\[\]\!]+/g, "_") || "unknown";

  const resourceURL = await saveFile(url, name + "__" + randomUUID());

  return `![${name}](${resourceURL})`;
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
