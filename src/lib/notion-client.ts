import { NOTION_TOKEN } from "./env";
import { Client, LogLevel } from "@notionhq/client";

// Initializing a client
export const notionClient = new Client({
  auth: NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});
