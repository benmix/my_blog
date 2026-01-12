import { CONFIG_SITE } from "@lib/constant";
import type { MetadataRoute } from "next";
import { resolveRobots } from "@lib/robots-resolve";

export const dynamic = "force-static";

export async function GET() {
  const robots: MetadataRoute.Robots = {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: CONFIG_SITE.siteUrl + "/sitemap.xml",
  };

  const robotsString = resolveRobots(robots);

  return new Response(robotsString);
}
