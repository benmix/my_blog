# Obsidian Sync

This project syncs Obsidian notes into `src/content` for static rendering.
The sync script converts common Obsidian link formats and exports image assets
to `public/content_images`.

## Environment Variables

- `OBSIDIAN_VAULT_PATH`: Absolute path to the Obsidian vault.
- `OBSIDIAN_CONTENT_DIR`: Subdirectory inside the vault to sync.
- `OBSIDIAN_OUTPUT_DIR`: Output directory for markdown files. Default `src/content`.
- `OBSIDIAN_CONTENT_IMAGES_DIR`: Output directory for images. Default `public/content_images`.
- `OBSIDIAN_CONTENT_IMAGES_URL`: Public URL prefix for images. Default `/content_images/`.
- `OBSIDIAN_ATTACHMENTS_DIR`: Required attachment directory inside the vault (e.g. `assets`).

## Usage

```bash
pnpm obsidian-sync
pnpm obsidian-sync --no-clean
```

## Supported Syntax

- `[[Note]]` and `[[Note|Alias]]` are converted to `/posts/...` links.
- `[[Note#Heading]]` is converted to `/posts/...#heading` using `github-slugger`.
- `![[image.png]]` is converted to markdown image.
- `![[image.png|Alt]]` is converted to markdown image.
- `![[image.png|300]]` or `![[image.png|300x200]]` is converted to `<img>` with size.
- `![alt](relative/path.png)` is converted to `/content_images/...` when the file exists.
- Image references by filename (e.g. `![[image.png]]`) are resolved from the attachments directory only.

## Notes

- Output filenames prefer frontmatter `EnglishName` when present.
- Whitespace in output filenames is normalized to underscores.
- Duplicate output paths after normalization will fail the sync to avoid slug conflicts.
- Exported images are renamed to `md5` hashes and copied into `OBSIDIAN_CONTENT_IMAGES_DIR`.
- `--no-clean` skips cleaning `OBSIDIAN_OUTPUT_DIR` and `OBSIDIAN_CONTENT_IMAGES_DIR`.
- Non-image embeds are left as plain links when a note match exists.
