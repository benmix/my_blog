import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type PageProperty =
  PageObjectResponse["properties"][keyof PageObjectResponse["properties"]];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterPages = (
  item:
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse,
): item is PageObjectResponse => item.object === "page" && "properties" in item;

export const getPropertyDate = (property: PageProperty) => {
  if (property.type === "date") {
    return property.date?.start || "";
  } else {
    return "";
  }
};

export const getPropertyTitle = (property: PageProperty) => {
  if (property.type === "title") {
    return property.title[0]?.plain_text || "";
  } else {
    return "";
  }
};
