"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";

import { cn } from "@lib/utils";

const ACTIVE_HEADING_TRIGGER_RATIO = 0.5;
const TOC_CENTER_THRESHOLD_PX = 32;

type TableOfContentsProps = {
  className?: string;
  label?: string;
  mode?: "desktop" | "mobile";
  toc?: import("@/types/blog").TocItem[];
};

function getIndentClass(depth: number) {
  return depth >= 4 ? "pl-3" : undefined;
}

function findActiveHeadingId(
  headings: HTMLElement[],
  fallbackId: string | null,
  triggerLine: number,
) {
  for (let index = headings.length - 1; index >= 0; index -= 1) {
    const heading = headings[index];

    if (heading.getBoundingClientRect().top <= triggerLine) {
      return heading.id;
    }
  }

  return fallbackId;
}

export function TableOfContents({
  className,
  label = "In This Article",
  mode = "desktop",
  toc,
}: TableOfContentsProps) {
  const fallbackId = toc?.[0]?.id ?? null;
  const [activeId, setActiveId] = useState<string | null>(fallbackId);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const activeIdRef = useRef<string | null>(fallbackId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!toc?.length) {
      setActiveId(null);
      activeIdRef.current = null;
      return;
    }

    if (mode !== "desktop") {
      setActiveId(fallbackId);
      activeIdRef.current = fallbackId;
      return;
    }

    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) {
      setActiveId(fallbackId);
      activeIdRef.current = fallbackId;
      return;
    }

    let frameId = 0;

    const updateActiveHeading = () => {
      frameId = 0;

      const triggerLine = window.innerHeight * ACTIVE_HEADING_TRIGGER_RATIO;
      const nextActiveId = findActiveHeadingId(headingElements, fallbackId, triggerLine);

      if (nextActiveId !== activeIdRef.current) {
        activeIdRef.current = nextActiveId;
        startTransition(() => {
          setActiveId(nextActiveId);
        });
      }
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveHeading);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [fallbackId, mode, toc]);

  useEffect(() => {
    if (mode !== "desktop" || !activeId) {
      return;
    }

    const activeLink = itemRefs.current[activeId];

    if (!activeLink) {
      return;
    }

    const scrollContainer = activeLink.closest("[data-sidebar-scroll]");

    if (!(scrollContainer instanceof HTMLElement)) {
      return;
    }

    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const linkCenter = linkRect.top - containerRect.top + linkRect.height / 2;
    const containerCenter = scrollContainer.clientHeight / 2;
    const centerDelta = linkCenter - containerCenter;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (Math.abs(centerDelta) <= TOC_CENTER_THRESHOLD_PX) {
      return;
    }

    const targetTop = scrollContainer.scrollTop + centerDelta;
    const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;

    scrollContainer.scrollTo({
      top: Math.max(0, Math.min(targetTop, maxScrollTop)),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeId, mode]);

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
                ref={(element) => {
                  itemRefs.current[item.id] = element;
                }}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-l border-transparent py-1 pr-2 font-sans text-[0.86rem] leading-[1.68] [text-wrap:pretty] text-muted-foreground transition-[border-color,color,padding] hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
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
        <p className="mb-4 font-mono text-[0.72rem] tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </p>
        {nav}
      </section>
    );
  }

  return (
    <aside
      className={cn(
        "hidden self-start lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto",
        className,
      )}
    >
      <p className="mb-4 font-mono text-[0.72rem] tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      {nav}
    </aside>
  );
}
