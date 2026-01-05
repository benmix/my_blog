import path from "node:path";
import { server } from "fumadocs-mdx/runtime/server";
import type { BlogPage } from "@/types";

const contentBase = path.join(process.cwd(), "src/content");

const loader = server<Record<string, any>, any>({
  doc: {
    passthroughs: ["title", "title_en", "date", "tags", "readingTime"],
  },
});

const contentImports = {
  "Learn_Binary_GCD_algorithm.md": () => import("../content/Learn_Binary_GCD_algorithm.md"),
  "Lookahead_And_Lookbehind_RegExp_Cheat_Sheet.md": () =>
    import("../content/Lookahead_And_Lookbehind_RegExp_Cheat_Sheet.md"),
  "Reading_record_of__Google_Software_Engineering_.md": () =>
    import("../content/Reading_record_of__Google_Software_Engineering_.md"),
  "Reading_record_of__The_Effective_Engineer_.md": () =>
    import("../content/Reading_record_of__The_Effective_Engineer_.md"),
  "Share_SOLID_And_Inject_And_IOC(DI).md": () =>
    import("../content/Share_SOLID_And_Inject_And_IOC(DI).md"),
  "Truncated_division_And_Euclidean_division.md": () =>
    import("../content/Truncated_division_And_Euclidean_division.md"),
  "_A_Simplified_Guide_to_Developing_Applications_with_Large_Models__Reading_Record.md": () =>
    import("../content/_A_Simplified_Guide_to_Developing_Applications_with_Large_Models__Reading_Record.md"),
  "_Beyond_the_Impossible__Reading_Record.md": () =>
    import("../content/_Beyond_the_Impossible__Reading_Record.md"),
  "_High_Performance_Browser_Networking__and__HTTP2_A_New_Excerpt_from_High_Performance_Browser_Networking__reading_record.md":
    () =>
      import("../content/_High_Performance_Browser_Networking__and__HTTP2_A_New_Excerpt_from_High_Performance_Browser_Networking__reading_record.md"),
};

const docsPromise = loader.docs("blog", contentBase, {}, contentImports) as Promise<any>;

async function loadPages(): Promise<BlogPage[]> {
  const docsEntry = (await docsPromise) as {
    toFumadocsSource: () => {
      files: Array<{ type: string; data: any; path: string }>;
    };
  };
  const { files } = docsEntry.toFumadocsSource();

  return files
    .filter((file): file is { type: "page"; data: any; path: string } => file.type === "page")
    .map((file) => {
      const normalizedPath = file.path.replace(/^\/+/, "").replace(/\.(mdx?|md)$/i, "");

      const slugSegments = normalizedPath.split("/").filter(Boolean);

      const frontmatter = {
        title: file.data.title,
        title_en: file.data.title_en,
        date: file.data.date,
        tags: file.data.tags ?? [],
        readingTime: file.data.readingTime,
      } satisfies BlogPage["data"];

      return {
        data: frontmatter,
        toc: file.data.toc,
        body: file.data.body,
        source: file.data.info?.path ?? file.path,
        slugs: slugSegments,
        url: file.data.url ?? `/posts/${slugSegments.join("/")}`,
      } as BlogPage;
    });
}

export const blogSource = {
  async getPages() {
    return loadPages();
  },

  async getPage(slugs: string[]) {
    const pages = await loadPages();
    const joined = slugs.join("/");
    return pages.find((page) => (page.slugs ?? []).join("/") === joined);
  },
};
