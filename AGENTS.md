# AGENTS.md

## 1. Purpose

This file defines repository-specific guidance for agents working in `my_blog`.
Do not restate generic platform rules here. Use this document for decisions that
depend on this codebase, BenMix's working style, and the project's actual
structure.

## 2. Working Style

- Prefer getting to the correct answer in one pass over fast but shallow
  iteration.
- Keep explanations concise and technical.
- Use Simplified Chinese for prose.
- Use English for code, comments, identifiers, commit messages, and all content
  inside code blocks.
- Do not explain beginner-level concepts unless explicitly asked.

## 3. Default Execution Model

- For non-trivial work, read the relevant files before proposing changes.
- Prefer a short plan before editing when the task is moderate or complex.
- Make the smallest reviewable change that solves the problem.
- Do not rewrite unrelated areas just because a broader refactor is possible.
- If a requirement is inferable from the repository, infer it and proceed.
- Ask for clarification only when missing information would materially change the
  implementation.

## 4. Project Snapshot

- Framework: `Next.js 16` with App Router.
- UI: `React 19`, `Tailwind CSS 4`, `next-themes`, `next-view-transitions`.
- Content pipeline: `content-collections` and `fumadocs`.
- Markdown features: math via `remark-math` and `rehype-katex`, code highlighting
  via `rehype-pretty-code` and `shiki`.
- Main content source: `src/content`.
- Static outputs: `rss.xml`, `sitemap.xml`, and `robots.txt`.
- Content sync workflow: Obsidian notes can be imported through
  `scripts/obsidian-sync.ts`.

## 5. Repository Map

- `src/app`: routes, layout, homepage, post pages, RSS, sitemap, robots.
- `src/components`: reusable UI, MDX rendering, theme switch, code blocks.
- `src/lib`: content loading, environment helpers, utility functions, site
  constants.
- `src/content`: markdown posts.
- `src/styles`: global theme tokens and feature-specific CSS.
- `scripts`: local automation scripts, especially Obsidian sync and import
  sorting.
- `docs`: supporting docs for workflows such as Obsidian sync.

## 6. High-Value Files

When changing behavior in these areas, inspect the related files first.

### Content Rendering

- `content-collections.ts`
- `src/lib/content-source.tsx`
- `src/lib/get-post.ts`
- `src/app/posts/[slug]/page.tsx`
- `src/components/mdx-components.tsx`
- `src/components/mdx-wrapper.tsx`

### Theme And Styling

- `src/components/layout.tsx`
- `src/components/theme-switch.tsx`
- `src/styles/global.css`
- `src/styles/default.css`
- `src/styles/flexoki.css`

### Site Metadata And Feeds

- `src/lib/constant.ts`
- `src/app/rss.xml/route.ts`
- `src/app/sitemap.xml/route.ts`
- `src/app/robots.txt/route.ts`

### Obsidian Sync

- `scripts/obsidian-sync.ts`
- `docs/obsidian.md`

## 7. Implementation Rules

- Preserve the existing project style unless there is a concrete reason to
  improve it.
- Do not use `import *` syntax. Prefer named imports or explicit type imports.
- Do not use barrel files or aggregate re-exports such as `index.ts` export
  hubs. Import from the concrete component/module file directly.
- Prefer server-first and static-friendly solutions when they fit the current
  architecture.
- Keep content pipeline changes compatible with existing markdown files unless a
  migration is explicitly requested.
- Avoid introducing new dependencies unless the current stack cannot reasonably
  solve the problem.
- If touching theme behavior, check both initial render behavior and post-hydration
  behavior.
- If touching content logic, consider slug stability, metadata fallback rules,
  feed output, and sorting behavior.
- If touching Obsidian sync, preserve filename normalization, link conversion,
  and image export behavior unless the task explicitly changes them.

## 8. Editing Expectations

- Prefer minimal, reviewable patches.
- Do not revert unrelated user changes.
- Do not rename or move content files unless the task requires it.
- Keep Markdown prose direct and specific; avoid generic AI-style filler.
- Add comments only when they explain intent that is otherwise hard to see.

## 9. Verification

Do not claim work is complete without fresh verification evidence appropriate to
the change.

### Recommended Checks By Change Type

- TypeScript or React changes:
  - `pnpm typecheck`
  - `pnpm lint`
- CSS or theme changes:
  - `pnpm lint:css`
  - manual browser check when behavior is visual or media-query dependent
- Formatting-sensitive changes:
  - `pnpm format`
- Obsidian sync changes:
  - `pnpm typecheck`
  - `pnpm obsidian-sync` when environment variables are available
- Documentation-only changes:
  - reread the diff and verify links, commands, and paths

If a command cannot be run, say so explicitly and state what remains unverified.

## 10. Common Commands

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

## 11. Content Conventions

- Posts live under `src/content`.
- Frontmatter may include `chinese_name`, `english_name`, `public_date`,
  `tags`, and `summary`.
- Title fallback currently prefers `chinese_name`, then `english_name`.
- Summary and reading time can be derived when not provided.
- Homepage ordering depends on publish date sorting in `src/lib/get-post.ts`.

## 12. Decision Bias

- Prefer correctness over cleverness.
- Prefer maintainability over local elegance.
- Prefer concrete repository evidence over generic framework advice.
- Prefer finishing the requested task over expanding scope.
