import { Client, LogLevel } from "@notionhq/client";
import { NOTION_BLOG_DATABASE_ID, NOTION_TOKEN } from "./env";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { filterPages, getPropertyDate, getPropertyTitle } from "./notion-utils";

// Initializing a client
const notion = new Client({
  auth: NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

const queryDataBaseLoop = async (
  database_id: string,
  pages: QueryDatabaseResponse["results"],
  start_cursor?: string,
) => {
  const result = await notion.databases.query({
    database_id,
    filter: {
      property: "Tags",
      multi_select: {
        contains: "blog",
      },
    },
    sorts: [
      {
        property: "Public Date",
        direction: "descending",
      },
    ],
    start_cursor,
  });

  pages.push(...result.results);

  if (result.has_more && result.next_cursor) {
    await queryDataBaseLoop(database_id, pages, result.next_cursor);
  }

  return pages;
};

export const getBlogs = async () => {
  const results = await queryDataBaseLoop(NOTION_BLOG_DATABASE_ID, []);
  return results.filter(filterPages).map((page) => {
    return {
      page_id: page.id,
      date: getPropertyDate(page?.properties?.["Public Date"]),
      title: getPropertyTitle(page?.properties?.["Name"]),
      title_en: getPropertyTitle(page?.properties?.["English Name"]),
    };
  });
};
