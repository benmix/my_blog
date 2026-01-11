import GithubSlugger from "github-slugger";
import { createHash } from "node:crypto";
import {
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const DEFAULT_CONTENT_IMAGES_DIR = path.join("public", "content_images");
const DEFAULT_CONTENT_IMAGES_URL = "/content_images/";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function isSubPath(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function sanitizeSegment(value: string) {
  return value
    .replace(/[/\\]/g, "_")
    .replace(/[:*?"<>|]/g, "_")
    .replace(/["'\u201C\u201D\u2018\u2019]/g, "_")
    .replace(/[\s]+/g, "_")
    .trim();
}

function normalizePosix(value: string) {
  return value.split(path.sep).join("/");
}

function stripMarkdownLinkTarget(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

async function collectMarkdownFiles(root: string) {
  const entries = await readdir(root, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

type NoteIndex = {
  byBaseName: Map<string, string>;
  byRelPath: Map<string, string>;
  byRelPathSanitized: Map<string, string>;
  byFilePath: Map<string, string>;
};

function extractEnglishName(markdown: string) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const lines = normalized.split(/\r?\n/);
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") {
    index += 1;
  }
  if (index >= lines.length || lines[index].trim() !== "---") {
    return "";
  }
  index += 1;
  const frontmatterLines: string[] = [];
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "---") break;
    frontmatterLines.push(line);
    index += 1;
  }
  if (!frontmatterLines.length) return "";
  for (const line of frontmatterLines) {
    const match = line.match(/^\s*english_name\s*:\s*(.+?)\s*$/i);
    if (!match) continue;
    const raw = match[1] ?? "";
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "|" || trimmed === ">") return "";
    return trimmed.replace(/^['"]|['"]$/g, "");
  }
  return "";
}

function trimFrontmatterValues(markdown: string) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const lines = normalized.split(/\r?\n/);
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") {
    index += 1;
  }
  if (index >= lines.length || lines[index].trim() !== "---") {
    return markdown;
  }
  const start = index;
  index += 1;
  const frontmatterLines: string[] = [];
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "---") break;
    frontmatterLines.push(line);
    index += 1;
  }
  if (!frontmatterLines.length) return markdown;

  const trimmedLines = frontmatterLines.map((line) => {
    const keyMatch = line.match(/^(\s*[^:]+:)(.*)$/);
    if (keyMatch) {
      const key = keyMatch[1];
      let value = keyMatch[2] ?? "";
      const raw = value.trim();
      const quotePairs: Array<[string, string]> = [
        ['"', '"'],
        ["'", "'"],
        ["\u201C", "\u201D"],
        ["\u2018", "\u2019"],
      ];
      const pair = quotePairs.find(
        ([open, close]) => raw.startsWith(open) && raw.endsWith(close),
      );
      if (pair) {
        const [open, close] = pair;
        const inner = raw.slice(open.length, raw.length - close.length).trim();
        value = ` ${open}${inner}${close}`;
      } else {
        value = raw ? ` ${raw}` : "";
      }
      return `${key}${value}`;
    }

    const listMatch = line.match(/^(\s*-\s+)(.*)$/);
    if (listMatch) {
      const prefix = listMatch[1];
      const item = (listMatch[2] ?? "").trim();
      return `${prefix}${item}`;
    }

    return line;
  });

  const newLines = [
    ...lines.slice(0, start + 1),
    ...trimmedLines,
    ...lines.slice(start + 1 + frontmatterLines.length),
  ];
  return newLines.join("\n");
}

function buildOutputMap(
  contentRoot: string,
  files: string[],
  contents: Map<string, string>,
) {
  const outputMap = new Map<string, string>();
  const outputConflicts = new Map<string, string>();

  for (const filePath of files) {
    const rel = path.relative(contentRoot, filePath);
    const dir = path.dirname(rel);
    const base = path.basename(rel, ".md");
    const sanitizedDir = dir
      .split(path.sep)
      .map((segment) => sanitizeSegment(segment))
      .filter(Boolean)
      .join(path.sep);
    const sanitizedBase = sanitizeSegment(base);
    const raw = contents.get(filePath) ?? "";
    const englishName = extractEnglishName(raw);

    let outputRelNoExt = "";
    if (englishName) {
      const sanitizedEnglish = sanitizeSegment(englishName);
      if (!sanitizedEnglish) {
        throw new Error(
          `Invalid EnglishName after sanitization: ${englishName} (${filePath})`,
        );
      }
      outputRelNoExt = normalizePosix(
        path.join(sanitizedDir, sanitizedEnglish),
      );
    } else {
      outputRelNoExt = normalizePosix(path.join(sanitizedDir, sanitizedBase));
    }

    const key = outputRelNoExt.toLowerCase();
    const existing = outputConflicts.get(key);
    if (existing && existing !== filePath) {
      throw new Error(
        `Duplicate output path after normalization: ${outputRelNoExt} (${filePath})`,
      );
    }
    outputConflicts.set(key, filePath);
    outputMap.set(filePath, outputRelNoExt);
  }

  return outputMap;
}

function buildNoteIndex(
  contentRoot: string,
  files: string[],
  outputMap: Map<string, string>,
) {
  const byBaseName = new Map<string, string>();
  const byRelPath = new Map<string, string>();
  const byRelPathSanitized = new Map<string, string>();
  const byFilePath = new Map<string, string>();
  const conflicts: string[] = [];

  for (const filePath of files) {
    const rel = path.relative(contentRoot, filePath);
    const relPosix = normalizePosix(rel);
    const relNoExt = relPosix.replace(/\.md$/i, "");
    const base = path.basename(rel, ".md");
    const outputRelNoExt = outputMap.get(filePath);
    if (!outputRelNoExt) {
      throw new Error(`Missing output mapping for: ${filePath}`);
    }

    const baseKey = base.toLowerCase();
    if (byBaseName.has(baseKey) && byBaseName.get(baseKey) !== outputRelNoExt) {
      conflicts.push(base);
    } else {
      byBaseName.set(baseKey, outputRelNoExt);
    }

    byRelPath.set(relNoExt, outputRelNoExt);
    byRelPathSanitized.set(outputRelNoExt, outputRelNoExt);
    byFilePath.set(filePath, outputRelNoExt);
  }

  if (conflicts.length > 0) {
    throw new Error(
      `Duplicate note names after normalization: ${conflicts.join(", ")}`,
    );
  }

  return { byBaseName, byRelPath, byRelPathSanitized, byFilePath };
}

type ImageCache = Map<string, string>;

type ImageIndex = {
  byFileName: Map<string, string>;
  byBaseName: Map<string, string[]>;
};

type ObsidianEmbedMeta = {
  target: string;
  alt: string;
  width?: number;
  height?: number;
};

async function collectImageFiles(root: string, files: Set<string>) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await collectImageFiles(fullPath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) {
      files.add(fullPath);
    }
  }
}

function buildImageIndex(imageFiles: Iterable<string>) {
  const byFileName = new Map<string, string>();
  const byBaseName = new Map<string, string[]>();

  for (const filePath of imageFiles) {
    const fileName = path.basename(filePath).toLowerCase();
    if (!byFileName.has(fileName)) {
      byFileName.set(fileName, filePath);
    } else if (byFileName.get(fileName) !== filePath) {
      console.warn(`Duplicate image filename: ${fileName}`);
    }

    const base = path.basename(filePath, path.extname(filePath)).toLowerCase();
    const list = byBaseName.get(base) ?? [];
    list.push(filePath);
    byBaseName.set(base, list);
  }

  return { byFileName, byBaseName };
}

function parseEmbedMeta(raw: string): ObsidianEmbedMeta {
  const parts = raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  const target = parts[0] ?? "";
  let alt = "";
  let width: number | undefined;
  let height: number | undefined;

  for (const part of parts.slice(1)) {
    if (/^\d+$/.test(part)) {
      width = Number(part);
      continue;
    }

    const sizeMatch = part.match(/^(\d+)\s*[xX]\s*(\d+)$/);
    if (sizeMatch) {
      width = Number(sizeMatch[1]);
      height = Number(sizeMatch[2]);
      continue;
    }

    if (!alt) {
      alt = part;
    }
  }

  return { target, alt, width, height };
}

async function copyImage(
  sourcePath: string,
  cache: ImageCache,
  contentImagesDir: string,
  contentImagesUrl: string,
) {
  const cached = cache.get(sourcePath);
  if (cached) {
    return cached;
  }

  const buffer = await readFile(sourcePath);
  const hash = createHash("md5").update(buffer).digest("hex");
  const ext = path.extname(sourcePath).toLowerCase();
  const fileName = `${hash}${ext || ""}`;
  const outputPath = path.join(contentImagesDir, fileName);

  await writeFile(outputPath, buffer);
  const url = `${contentImagesUrl}${fileName}`;
  cache.set(sourcePath, url);
  return url;
}

function resolveWikiTarget(
  target: string,
  noteIndex: NoteIndex,
  currentRelPath: string,
) {
  const normalized = normalizePosix(target.replace(/\.md$/i, ""));
  if (!normalized) return undefined;

  const direct = noteIndex.byRelPath.get(normalized);
  if (direct) return direct;

  const parts = normalized.split("/");
  if (parts.length > 1) {
    const sanitized = parts.map((part) => sanitizeSegment(part)).join("/");
    const sanitizedMatch = noteIndex.byRelPathSanitized.get(sanitized);
    if (sanitizedMatch) return sanitizedMatch;
  }

  const base = parts[parts.length - 1].toLowerCase();
  const baseMatch = noteIndex.byBaseName.get(base);
  if (baseMatch) return baseMatch;

  const relative = normalizePosix(
    path.join(path.dirname(currentRelPath), normalized),
  );
  const relativeMatch = noteIndex.byRelPath.get(relative);
  if (relativeMatch) return relativeMatch;

  return undefined;
}

async function transformMarkdown(
  markdown: string,
  noteIndex: NoteIndex,
  options: {
    contentRoot: string;
    filePath: string;
    outputRelPath: string;
    imageCache: ImageCache;
    imageIndex: ImageIndex;
    contentImagesDir: string;
    contentImagesUrl: string;
    vaultRoot: string;
    attachmentRoot: string;
  },
) {
  let result = markdown;
  const slugger = new GithubSlugger();

  const resolveImagePath = async (rawPath: string) => {
    const trimmed = rawPath.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return undefined;

    const normalized = trimmed.replace(/^file:\/\//i, "");
    const hasSeparator = /[\\/]/.test(normalized);
    let absolute: string | undefined;

    if (path.isAbsolute(normalized)) {
      absolute = path.join(options.vaultRoot, normalized.replace(/^\/+/, ""));
    } else if (hasSeparator) {
      absolute = path.resolve(path.dirname(options.filePath), normalized);
    } else {
      const fileNameKey = normalized.toLowerCase();
      const directMatch = options.imageIndex.byFileName.get(fileNameKey);
      if (directMatch) {
        absolute = directMatch;
      } else {
        const base = fileNameKey.replace(/\.[a-z0-9]+$/i, "");
        const matches = options.imageIndex.byBaseName.get(base) ?? [];
        if (matches.length === 1) {
          absolute = matches[0];
        } else if (matches.length > 1) {
          console.warn(`Ambiguous image reference: ${normalized}`);
          absolute = matches[0];
        }
      }
    }

    try {
      if (!absolute) return undefined;
      if (!isSubPath(options.attachmentRoot, absolute)) return undefined;
      const info = await stat(absolute);
      if (!info.isFile()) return undefined;
    } catch {
      return undefined;
    }

    const ext = path.extname(absolute).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) return undefined;

    return copyImage(
      absolute,
      options.imageCache,
      options.contentImagesDir,
      options.contentImagesUrl,
    );
  };

  const embedRegex = /!\[\[([^\]]+)\]\]/g;
  const embedMatches = [...result.matchAll(embedRegex)];
  for (const match of embedMatches) {
    const raw = match[1] ?? "";
    const { target, alt, width, height } = parseEmbedMeta(raw);
    const imageUrl = await resolveImagePath(target);
    if (imageUrl) {
      if (width || height) {
        const widthAttr = width ? ` width="${width}"` : "";
        const heightAttr = height ? ` height="${height}"` : "";
        const altAttr = alt ? ` alt="${alt}"` : ` alt=""`;
        result = result.replace(
          match[0],
          `<img src="${imageUrl}"${altAttr}${widthAttr}${heightAttr} />`,
        );
      } else {
        result = result.replace(match[0], `![${alt}](${imageUrl})`);
      }
      continue;
    }

    const resolvedTarget = resolveWikiTarget(
      target,
      noteIndex,
      options.outputRelPath,
    );
    if (resolvedTarget) {
      const url = `/posts/${resolvedTarget}`;
      result = result.replace(match[0], `[${alt || target}](${url})`);
    }
  }

  const wikiRegex = /\[\[([^\]]+)\]\]/g;
  const wikiMatches = [...result.matchAll(wikiRegex)];
  for (const match of wikiMatches) {
    const raw = match[1] ?? "";
    const [targetRaw, aliasRaw] = raw.split("|");
    const target = (targetRaw ?? "").trim();
    const alias = (aliasRaw ?? "").trim();

    const [pathPart, headingPart] = target.split("#");
    const resolvedTarget = resolveWikiTarget(
      pathPart,
      noteIndex,
      options.outputRelPath,
    );
    if (resolvedTarget) {
      const heading = headingPart ? `#${slugger.slug(headingPart)}` : "";
      const url = `/posts/${resolvedTarget}${heading}`;
      result = result.replace(match[0], `[${alias || pathPart}](${url})`);
      continue;
    }

    result = result.replace(match[0], alias ? `[${alias}](${target})` : target);
  }

  const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imageMatches = [...result.matchAll(mdImageRegex)];
  for (const match of imageMatches) {
    const alt = match[1] ?? "";
    const rawTarget = stripMarkdownLinkTarget(match[2] ?? "");
    const imageUrl = await resolveImagePath(rawTarget);
    if (imageUrl) {
      result = result.replace(match[0], `![${alt}](${imageUrl})`);
    }
  }

  return result;
}

async function main() {
  const vaultRoot = requireEnv("OBSIDIAN_VAULT_PATH");
  const contentDir = requireEnv("OBSIDIAN_CONTENT_DIR");
  const outputRoot =
    process.env.OBSIDIAN_OUTPUT_DIR || path.join("src", "content");
  const contentImagesDir =
    process.env.OBSIDIAN_CONTENT_IMAGES_DIR || DEFAULT_CONTENT_IMAGES_DIR;
  const contentImagesUrl =
    process.env.OBSIDIAN_CONTENT_IMAGES_URL || DEFAULT_CONTENT_IMAGES_URL;
  const args = new Set(process.argv.slice(2));
  const shouldClean = args.has("--no-clean") ? false : true;

  const contentRoot = path.resolve(vaultRoot, contentDir);
  const repoRoot = path.resolve(process.cwd());
  const outputRootResolved = path.resolve(outputRoot);
  const contentImagesDirResolved = path.resolve(contentImagesDir);
  const attachmentsDir = process.env.OBSIDIAN_ATTACHMENTS_DIR;
  if (!attachmentsDir) {
    throw new Error("Missing required env var: OBSIDIAN_ATTACHMENTS_DIR");
  }
  const attachmentRoot = path.resolve(vaultRoot, attachmentsDir);

  if (shouldClean) {
    if (!isSubPath(repoRoot, outputRootResolved)) {
      throw new Error(
        `Refusing to clean output dir outside repo: ${outputRootResolved}`,
      );
    }
    if (!isSubPath(repoRoot, contentImagesDirResolved)) {
      throw new Error(
        `Refusing to clean images dir outside repo: ${contentImagesDirResolved}`,
      );
    }

    await rm(outputRootResolved, { recursive: true, force: true });
    await rm(contentImagesDirResolved, { recursive: true, force: true });
  }

  await mkdir(outputRootResolved, { recursive: true });
  await mkdir(contentImagesDirResolved, { recursive: true });

  const files = await collectMarkdownFiles(contentRoot);
  const imageFiles = new Set<string>();
  await collectImageFiles(attachmentRoot, imageFiles);
  const imageIndex = buildImageIndex(imageFiles);
  const contents = new Map<string, string>();
  for (const filePath of files) {
    const raw = await readFile(filePath, "utf-8");
    contents.set(filePath, trimFrontmatterValues(raw));
  }
  const outputMap = buildOutputMap(contentRoot, files, contents);
  const noteIndex = buildNoteIndex(contentRoot, files, outputMap);
  const imageCache: ImageCache = new Map();
  for (const filePath of files) {
    const raw = contents.get(filePath) ?? "";
    const outputRelNoExt = outputMap.get(filePath) ?? "";

    if (!outputRelNoExt) {
      throw new Error(`Failed to resolve output path: ${filePath}`);
    }

    const outputRel = `${outputRelNoExt}.md`;
    const outputPath = path.join(outputRootResolved, outputRel);

    const transformed = await transformMarkdown(raw, noteIndex, {
      contentRoot,
      filePath,
      outputRelPath: outputRelNoExt,
      imageCache,
      imageIndex,
      contentImagesDir: contentImagesDirResolved,
      contentImagesUrl,
      vaultRoot,
      attachmentRoot,
    });

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, transformed);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
