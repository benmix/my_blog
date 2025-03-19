import { pageToMarkdownString } from "@lib/md";
import { getBlogs } from "@lib/notion-api";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

async function main() {
  if (existsSync("./public/content_images/")) {
    rmSync("./public/content_images/", { recursive: true });
  }

  mkdirSync("./public/content_images/", { recursive: true });

  const blogs = await getBlogs();

  for (const blog of blogs) {
    const markdownContent = await pageToMarkdownString(blog.page_id);
    const markdown = [];

    markdown.push(`---`);
    markdown.push(`title_en: ${blog.title_en}`);
    markdown.push(`title: ${blog.title}`);
    markdown.push(`date: ${blog.date}`);
    markdown.push(`---`);
    markdown.push(``);
    markdown.push(`${markdownContent?.parent}`);

    writeFileSync(
      `./src/content/${blog.title_en.replace(/[\s\/]+/g, "_")}.md`,
      markdown.join("\n"),
    );
  }
}

main();
