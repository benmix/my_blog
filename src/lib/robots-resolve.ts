import { MetadataRoute } from "next";

function resolveArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

export function resolveRobots(data: MetadataRoute.Robots): string {
  let content = "";
  const rules = Array.isArray(data.rules) ? data.rules : [data.rules];
  for (const rule of rules) {
    const userAgent = resolveArray(rule.userAgent || ["*"]);
    for (const agent of userAgent) {
      content += `User-Agent: ${agent}\n`;
    }
    if (rule.allow) {
      const allow = resolveArray(rule.allow);
      for (const item of allow) {
        content += `Allow: ${item}\n`;
      }
    }
    if (rule.disallow) {
      const disallow = resolveArray(rule.disallow);
      for (const item of disallow) {
        content += `Disallow: ${item}\n`;
      }
    }
    if (rule.crawlDelay) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`;
    }
    content += "\n";
  }
  if (data.host) {
    content += `Host: ${data.host}\n`;
  }
  if (data.sitemap) {
    const sitemap = resolveArray(data.sitemap);
    sitemap.forEach((item) => {
      content += `Sitemap: ${item}\n`;
    });
  }

  return content;
}
