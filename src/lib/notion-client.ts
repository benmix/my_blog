import { Client, LogLevel } from "@notionhq/client";
import { NOTION_TOKEN } from "./env";

// Initializing a client
export const notionClient = new Client({
  auth: NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});
