import { pageToMarkdownString } from "@lib/md";
import { getBlogs } from "@lib/notion-api";
import * as fs from "node:fs";

async function main() {
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

    fs.writeFileSync(`./src/blogs/${blog.title_en}.md`, markdown.join("\n"));
  }
}

main();
