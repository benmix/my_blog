import { format, toDate } from "date-fns";
import { Link } from "@components/link";
import type { Post } from "content-collections";
import type { ReactNode } from "react";
import { SiteFooter } from "@components/site-footer";

type WrapperProps = {
  children?: ReactNode;
  metadata: Post;
};

function formatReadingTime(readingTimeText?: string) {
  if (!readingTimeText) {
    return null;
  }

  const match = readingTimeText.match(/^(\d+)\s+min/i);
  if (!match) {
    return readingTimeText;
  }

  const minutes = Number(match[1]);
  if (!Number.isFinite(minutes)) {
    return readingTimeText;
  }

  return `Est. Read: ${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`;
}

export const Wrapper = ({ children, metadata }: WrapperProps) => {
  const heading = metadata.chinese_name ?? metadata.english_name ?? "";
  const normalizedDate = metadata.date ? toDate(metadata.date) : null;
  const readingTime = formatReadingTime(metadata.reading_time?.text);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-6 py-8 sm:px-12 md:py-12">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.24em] text-muted-foreground uppercase">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Articles</span>
      </nav>

      <header className="mb-12">
        <div className="mb-8 border-t-[3px] border-b border-border border-t-foreground py-6 text-center">
          <h1 className="px-4 font-serif text-3xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
            {heading}
          </h1>
          <div className="mt-6 flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
            <span>{normalizedDate ? format(normalizedDate, "EEEE, MMMM d, yyyy") : null}</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </header>

      <article
        className="text-foreground [&>p:first-of-type:first-letter]:float-left [&>p:first-of-type:first-letter]:pt-1 [&>p:first-of-type:first-letter]:pr-2 [&>p:first-of-type:first-letter]:pl-[3px] [&>p:first-of-type:first-letter]:font-serif [&>p:first-of-type:first-letter]:text-[4.5rem] [&>p:first-of-type:first-letter]:leading-[0.85] [&>p:first-of-type:first-letter]:font-bold [&>p:first-of-type:first-letter]:text-foreground"
      >
        {children}
      </article>

      <SiteFooter />
    </main>
  );
};
