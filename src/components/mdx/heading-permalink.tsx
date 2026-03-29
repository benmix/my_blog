import { Link } from "@components/link";

export function HeadingPermalink({ id }: { id?: string }) {
  if (!id) {
    return null;
  }

  return (
    <Link
      href={`#${id}`}
      aria-label={`Permalink for ${id}`}
      className="ml-3 align-middle font-mono text-[0.68rem] font-medium tracking-[0.14em] text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
    >
      #
    </Link>
  );
}
