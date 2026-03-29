"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@lib/utils";

type TableOfContentsProps = {
  className?: string;
  label?: string;
  mode?: "desktop" | "mobile";
  toc?: import("@/types/blog").TocItem[];
};

function getIndentClass(depth: number) {
  return depth >= 4 ? "pl-4" : undefined;
}

export function TableOfContents({
  className,
  label = "In This Article",
  mode = "desktop",
  toc,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(toc?.[0]?.id ?? null);

  useEffect(() => {
    if (!toc?.length) {
      setActiveId(null);
      return;
    }

    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) {
      setActiveId(toc[0]?.id ?? null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
          );

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
          return;
        }

        const nearestPastHeading = headingElements
          .filter((heading) => heading.getBoundingClientRect().top <= 140)
          .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];

        setActiveId(nearestPastHeading?.id ?? toc[0]?.id ?? null);
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  if (!toc?.length) {
    return null;
  }

  const nav = (
    <nav aria-label="Table of contents">
      <ol className="space-y-1.5">
        {toc.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-l border-transparent py-1 pr-2 font-sans text-[0.98rem] leading-[1.6] [text-wrap:pretty] text-muted-foreground transition-[border-color,color,padding] hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
                  getIndentClass(item.depth),
                  isActive && "border-border pl-3 text-foreground",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (mode === "mobile") {
    return (
      <section className={cn("mb-10 border-y border-border/80 py-5 lg:hidden", className)}>
        <p className="mb-4 font-mono text-[0.8rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
          {label}
        </p>
        {nav}
      </section>
    );
  }

  return (
    <aside
      className={cn(
        "hidden self-start lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-l lg:border-border/80 lg:pl-5",
        className,
      )}
    >
      <p className="mb-4 font-mono text-[0.8rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </p>
      {nav}
    </aside>
  );
}
