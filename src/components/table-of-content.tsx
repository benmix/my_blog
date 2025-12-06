"use client";

import type { Heading } from "nextra";
import { FC, useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "@remixicon/react";
import { cn } from "@lib/utils";

export const TocSider: FC<{ toc: Heading[] }> = ({ toc }) => {
  const [expand, setExpand] = useState<boolean>(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!toc?.length) return;

    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top
          );

        if (visibleEntries.length) {
          setActiveId(visibleEntries[0].target.id);
          return;
        }

        const aboveFold = headingElements
          .filter((heading) => heading.getBoundingClientRect().top <= 120)
          .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);

        if (aboveFold.length) {
          setActiveId(aboveFold[0].id);
        }
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  const IconToUse = expand ? <RiArrowLeftDoubleLine /> : <RiArrowRightDoubleLine />;

  return toc?.length ? (
    <div className="fixed -right-2 z-50 h-full pb-60 max-lg:hidden">
      <div
        data-state={expand ? "open" : "closed"}
        className={cn(
          "toc-panel scroll-hidden h-fit max-h-full overflow-auto rounded-l-md p-4 shadow-md"
        )}
      >
        <div className={cn("w-[18vw] pr-2")}>
          <ul>
            {toc.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "text-gray-400 hover:text-gray-600",
                    activeId === heading.id && "text-gray-600"
                  )}
                  aria-current={activeId === heading.id ? "true" : undefined}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button
        data-state={expand ? "open" : "closed"}
        className="absolute top-2 right-2 rounded-l-md rounded-r-none data-[state=closed]:shadow-md"
        variant="ghost"
        onClick={() => {
          setExpand((prev) => !prev);
        }}
      >
        {IconToUse}
      </Button>
    </div>
  ) : null;
};
