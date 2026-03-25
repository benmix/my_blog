import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-prose mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">404</p>
      <h1 className="text-3xl font-medium text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you requested does not exist, or the link is no longer valid.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        Back to home
      </Link>
    </section>
  );
}
