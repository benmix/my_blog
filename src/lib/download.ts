import * as fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";

export async function saveFile(url: string, name: string) {
  const outputDir = "./public/content_images/";
  const visitDir = "/content_images/";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch Failed, HTTP Status: ${response.status}, Request URL: ${URL}`);
  }

  const buffer = await response.arrayBuffer();

  const subPath = `${name}.${(await fileTypeFromBuffer(buffer))?.ext || "unknown"}`;

  fs.writeFileSync(outputDir + subPath, Buffer.from(buffer));

  return visitDir + subPath;
}
