import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readdir, rename, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import sharp from "sharp";

const SOURCE_EXTENSIONS = new Set([".avif", ".heic", ".heif", ".jpeg", ".jpg", ".png", ".webp"]);
const NON_WEBP_SOURCE_EXTENSIONS = new Set([".avif", ".heic", ".heif", ".jpeg", ".jpg", ".png"]);

const DEFAULT_PHOTO_DIR = path.join("public", "photos");
const PIPELINE_MARKER = "my_blog-photo-pipeline/v1";
const COPYRIGHT = "Copyright 2026 BenMix. All rights reserved.";
const DESCRIPTION = "Homepage photo asset for BenMix Blog.";
const WATERMARK_TEXT = "© BenMix 2026";
const WEBP_QUALITY = 72;
const LARGE_WEBP_QUALITY = 54;
const WEBP_EFFORT = 6;
const MAX_OUTPUT_WIDTH = 1600;
const LARGE_FILE_THRESHOLD_BYTES = 150 * 1024;
const execFileAsync = promisify(execFile);

type CliOptions = {
  directory: string;
  force: boolean;
};

type PhotoTask = {
  kind: "convert" | "optimize";
  sourcePath: string;
  targetPath: string;
};

function getWebpQuality(sourceSize: number) {
  return sourceSize > LARGE_FILE_THRESHOLD_BYTES ? LARGE_WEBP_QUALITY : WEBP_QUALITY;
}

function parseArgs(argv: string[]): CliOptions {
  let directory = DEFAULT_PHOTO_DIR;
  let force = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--force") {
      force = true;
      continue;
    }

    if (arg === "--dir") {
      directory = argv[index + 1] ?? directory;
      index += 1;
      continue;
    }
  }

  return { directory, force };
}

async function collectFiles(root: string) {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function getWatermarkOverlay(width: number) {
  const fontSize = Math.max(22, Math.round(width / 42));
  const paddingX = Math.max(18, Math.round(width * 0.035));
  const paddingY = Math.max(14, Math.round(fontSize * 0.45));
  const overlayWidth = Math.round(fontSize * WATERMARK_TEXT.length * 0.82) + paddingX * 2;
  const overlayHeight = fontSize + paddingY * 2;

  return Buffer.from(
    `
      <svg width="${overlayWidth}" height="${overlayHeight}" viewBox="0 0 ${overlayWidth} ${overlayHeight}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="${overlayWidth - paddingX + 1}"
          y="${paddingY + fontSize + 1}"
          text-anchor="end"
          font-family="'SF Mono','Fira Code','Cascadia Code',monospace"
          font-size="${fontSize}"
          letter-spacing="0.04em"
          fill="rgba(22,20,18,0.14)"
        >
          ${WATERMARK_TEXT}
        </text>
        <text
          x="${overlayWidth - paddingX}"
          y="${paddingY + fontSize}"
          text-anchor="end"
          font-family="'SF Mono','Fira Code','Cascadia Code',monospace"
          font-size="${fontSize}"
          letter-spacing="0.04em"
          fill="rgba(248,244,234,0.28)"
        >
          ${WATERMARK_TEXT}
        </text>
      </svg>
    `.trim(),
  );
}

function getExifMetadata() {
  return {
    IFD0: {
      Artist: "BenMix",
      Copyright: COPYRIGHT,
      DateTime: new Date().toISOString(),
      ImageDescription: DESCRIPTION,
      Software: PIPELINE_MARKER,
    },
  };
}

async function hasPipelineMarker(filePath: string) {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.exif?.includes(Buffer.from(PIPELINE_MARKER, "utf8")) ?? false;
  } catch {
    return false;
  }
}

async function shouldProcessTask(task: PhotoTask, force: boolean) {
  const targetExists = await stat(task.targetPath)
    .then(() => true)
    .catch(() => false);

  if (!targetExists) {
    return true;
  }

  const targetHasMarker = await hasPipelineMarker(task.targetPath);

  if (task.kind === "optimize" && targetHasMarker && !force) {
    return false;
  }

  if (force) {
    return true;
  }

  if (task.kind === "optimize") {
    return true;
  }

  if (!targetHasMarker) {
    return true;
  }

  const [sourceStats, targetStats] = await Promise.all([
    stat(task.sourcePath),
    stat(task.targetPath),
  ]);

  return sourceStats.mtimeMs > targetStats.mtimeMs;
}

function resolveTargetPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".webp") {
    return filePath;
  }

  return path.format({
    dir: path.dirname(filePath),
    ext: ".webp",
    name: path.basename(filePath, path.extname(filePath)),
  });
}

function buildTasks(files: string[]) {
  const sourceFiles = files.filter((filePath) =>
    SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
  const siblingSourceKeys = new Set(
    sourceFiles
      .filter((filePath) => NON_WEBP_SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
      .map((filePath) =>
        path
          .join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)))
          .toLowerCase(),
      ),
  );

  return sourceFiles.flatMap((filePath): PhotoTask[] => {
    const extension = path.extname(filePath).toLowerCase();
    const siblingKey = path
      .join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)))
      .toLowerCase();

    if (extension === ".webp" && siblingSourceKeys.has(siblingKey)) {
      return [];
    }

    return [
      {
        kind: extension === ".webp" ? "optimize" : "convert",
        sourcePath: filePath,
        targetPath: resolveTargetPath(filePath),
      },
    ];
  });
}

async function processTask(task: PhotoTask) {
  const tempDir = await mkdtemp(path.join(tmpdir(), "my-blog-photos-"));

  try {
    const sourceStats = await stat(task.sourcePath);
    const sourceExtension = path.extname(task.sourcePath).toLowerCase();
    const sourceHasMarker = await hasPipelineMarker(task.sourcePath);
    const rasterInputPath =
      sourceExtension === ".heic" || sourceExtension === ".heif"
        ? path.join(tempDir, `${path.basename(task.sourcePath, path.extname(task.sourcePath))}.png`)
        : task.sourcePath;

    if (rasterInputPath !== task.sourcePath) {
      await execFileAsync("sips", [
        "-s",
        "format",
        "png",
        task.sourcePath,
        "--out",
        rasterInputPath,
      ]);
    }

    const image = sharp(rasterInputPath, { failOn: "warning" });
    const metadata = await image.metadata();
    const resizedWidth =
      metadata.width && metadata.width > MAX_OUTPUT_WIDTH ? MAX_OUTPUT_WIDTH : undefined;
    const width = resizedWidth ?? metadata.width;

    if (!width) {
      throw new Error(`Unable to determine output dimensions for: ${task.sourcePath}`);
    }

    const baseImage = image.rotate();
    const preparedImage = resizedWidth ? baseImage.resize({ width: resizedWidth }) : baseImage;

    await mkdir(path.dirname(task.targetPath), { recursive: true });
    const outputPath =
      task.sourcePath === task.targetPath ? `${task.targetPath}.tmp.webp` : task.targetPath;
    const pipeline = preparedImage.withExifMerge(getExifMetadata()).webp({
      effort: WEBP_EFFORT,
      quality: getWebpQuality(sourceStats.size),
    });

    if (task.kind === "optimize" && sourceHasMarker) {
      await pipeline.toFile(outputPath);
    } else {
      await pipeline
        .composite([
          {
            input: getWatermarkOverlay(width),
            gravity: "northeast",
          },
        ])
        .toFile(outputPath);
    }

    if (outputPath !== task.targetPath) {
      await rename(outputPath, task.targetPath);
    }
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const directory = path.resolve(options.directory);
  const files = await collectFiles(directory);
  const tasks = buildTasks(files);

  if (!tasks.length) {
    console.log(`No supported photo files found in ${directory}`);
    return;
  }

  let processedCount = 0;

  for (const task of tasks) {
    const shouldProcess = await shouldProcessTask(task, options.force);

    if (!shouldProcess) {
      console.log(`skip ${path.relative(process.cwd(), task.targetPath)}`);
      continue;
    }

    await processTask(task);
    processedCount += 1;
    console.log(
      `${task.kind === "convert" ? "build" : "refresh"} ${path.relative(process.cwd(), task.targetPath)}`,
    );
  }

  console.log(`Processed ${processedCount} photo file(s).`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
