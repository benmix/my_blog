import { NOTION_BLOG_DATABASE_ID, NOTION_TOKEN } from "./env";
import {
  filterPages,
  getPropertyDate,
  getPropertyText,
  getPropertyTitle,
} from "./notion-utils";
import { Client, LogLevel, isFullDatabase } from "@notionhq/client";
import { QueryDataSourceResponse } from "@notionhq/client/build/src/api-endpoints";

// Initializing a client
const notion = new Client({
  auth: NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

const getDataSourceId = async (databaseId: string) => {
  const database = await notion.databases.retrieve({
    database_id: databaseId,
  });

  if (!isFullDatabase(database)) {
    throw new Error(`Database ${databaseId} could not be retrieved`);
  }

  const dataSourceId = database.data_sources?.[0]?.id;

  if (!dataSourceId) {
    throw new Error(`No data source found for database ${databaseId}`);
  }

  return dataSourceId;
};

const queryDataSourceLoop = async (
  data_source_id: string,
  pages: QueryDataSourceResponse["results"],
  start_cursor?: string,
) => {
  const result = await notion.dataSources.query({
    data_source_id,
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
    await queryDataSourceLoop(data_source_id, pages, result.next_cursor);
  }

  return pages;
};

export const getBlogs = async () => {
  const dataSourceId = await getDataSourceId(NOTION_BLOG_DATABASE_ID);
  const results = await queryDataSourceLoop(dataSourceId, []);
  return results.filter(filterPages).map((page) => {
    return {
      page_id: page.id,
      date: getPropertyDate(page?.properties?.["Public Date"]),
      title: getPropertyTitle(page?.properties?.["Name"]),
      title_en: getPropertyText(page?.properties?.["English Name"]),
    };
  });
};
