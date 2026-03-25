# BenMix's Blog

这是一个基于 `Next.js 16`、`React 19` 和 `content-collections` 构建的静态博客项目。
文章内容存放在 `src/content`，渲染路径为 `/posts/[slug]`。项目同时提供 `RSS`、`sitemap`、`robots.txt`、数学公式、代码高亮、主题切换，以及从 Obsidian 笔记同步内容的脚本。

## 技术栈

- `Next.js 16` + App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `content-collections` + `fumadocs`
- `remark-math` + `rehype-katex`
- `rehype-pretty-code` + `shiki`
- `oxlint` + `oxfmt` + `stylelint`

## 项目结构

```text
.
├── src/app                 # Next.js routes, layout, RSS, sitemap, robots
├── src/components          # UI and MDX rendering components
├── src/content             # Markdown content source
├── src/lib                 # Content loading, env helpers, utility functions
├── src/styles              # Global and feature-specific styles
├── public                  # Static assets and synced content images
├── scripts                 # Local automation scripts
└── docs                    # Supplemental documentation
```

## 本地开发

建议使用 `pnpm`。

```bash
pnpm install
pnpm dev
```

默认开发地址通常是：

```text
http://localhost:3000
```

## 常用命令

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm lint:fix:sort-imports
pnpm format
pnpm format:write
pnpm lint:css
pnpm lint:css:fix
pnpm obsidian-sync
```

命令说明：

- `pnpm dev`: 启动本地开发服务器，使用 Turbopack。
- `pnpm build`: 生成生产构建。
- `pnpm start`: 启动生产构建后的服务。
- `pnpm typecheck`: 执行 TypeScript 类型检查。
- `pnpm lint`: 执行 JavaScript / TypeScript lint。
- `pnpm lint:fix`: 自动修复部分 lint 问题。
- `pnpm lint:fix:sort-imports`: 修复 import 排序。
- `pnpm format`: 检查代码格式。
- `pnpm format:write`: 写入格式化结果。
- `pnpm lint:css`: 检查样式文件。
- `pnpm lint:css:fix`: 自动修复部分样式问题。
- `pnpm obsidian-sync`: 从 Obsidian vault 同步内容到博客目录。

## 内容系统

文章来源目录为 `src/content`，当前通过 `content-collections` 读取并在构建时完成以下处理：

- 从 Frontmatter 中读取 `chinese_name`、`english_name`、`public_date`、`tags` 等字段。
- 自动生成摘要与阅读时间。
- 使用 `remark-math` 和 `rehype-katex` 渲染数学公式。
- 使用 `rehype-pretty-code` 和 `shiki` 处理代码块高亮。
- 生成文章 URL，格式为 `/posts/<slug>`。
- 按发布日期倒序展示首页文章列表。

支持的站点输出包括：

- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt`

## Obsidian 同步

仓库提供了 `scripts/obsidian-sync.ts`，用于将 Obsidian 笔记同步到 `src/content`，并把图片导出到 `public/content_images`。

运行前需要设置以下环境变量：

- `OBSIDIAN_VAULT_PATH`: Obsidian vault 的绝对路径。
- `OBSIDIAN_CONTENT_DIR`: vault 内要同步的内容目录。
- `OBSIDIAN_OUTPUT_DIR`: Markdown 输出目录，默认是 `src/content`。
- `OBSIDIAN_CONTENT_IMAGES_DIR`: 图片输出目录，默认是 `public/content_images`。
- `OBSIDIAN_CONTENT_IMAGES_URL`: 图片的公开 URL 前缀，默认是 `/content_images/`。
- `OBSIDIAN_ATTACHMENTS_DIR`: vault 内附件目录名，例如 `assets`。

示例：

```bash
pnpm obsidian-sync
pnpm obsidian-sync --no-clean
```

同步脚本当前支持：

- `[[Note]]` / `[[Note|Alias]]`
- `[[Note#Heading]]`
- `![[image.png]]`
- `![[image.png|Alt]]`
- `![[image.png|300]]`
- `![[image.png|300x200]]`
- 标准 Markdown 图片相对路径转换

更完整的说明见 [docs/obsidian.md](/Users/benmix/Code/my_blog/docs/obsidian.md)。

## Frontmatter 参考

文章可使用如下 Frontmatter 字段：

```yaml
---
chinese_name: Example Chinese Title
english_name: Example English Title
public_date: 2026-03-26
tags:
  - engineering
  - notes
summary: Short summary for feed and listing
---
```

其中：

- `chinese_name` 和 `english_name` 用于标题显示。
- `public_date` 用于排序与输出发布时间。
- `summary` 未提供时会从正文自动提取。

## 维护建议

提交前至少运行以下检查：

```bash
pnpm typecheck
pnpm lint
pnpm format
pnpm lint:css
```

如果改动涉及内容同步脚本，也建议同步检查：

```bash
pnpm obsidian-sync --no-clean
```
