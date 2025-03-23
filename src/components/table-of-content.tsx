"use client";

import type { Heading } from "nextra";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

export const TocSider: FC<{ toc: Heading[] }> = ({ toc }) => {
  const [expand, setExpand] = useState<boolean>(true);
  const [done, setDone] = useState<boolean>(true);
  const timer = useRef<NodeJS.Timeout>(undefined);

  const IconToUse = expand ? (
    <RiArrowLeftDoubleLine />
  ) : (
    <RiArrowRightDoubleLine />
  );

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return toc?.length ? (
    <div className="fixed -right-2 max-lg:hidden z-50">
      <Button
        data-state={expand ? "open" : "closed"}
        className="absolute top-2 right-2 data-[state=closed]:shadow-md rounded-l-md rounded-r-none"
        variant={"ghost"}
        onClick={() => {
          setDone(false);
          setExpand(!expand);
          timer.current = setTimeout(() => {
            setDone(true);
          }, 150);
        }}
      >
        {IconToUse}
      </Button>
      <div
        data-state={expand ? "open" : "closed"}
        data-animate-state={done ? "done" : "animating"}
        className={cn(
          "p-4 shadow-md rounded-l-md",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:fade-in-0 data-[state=open]:data-[animate-state=done]:block",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:fade-out-0 data-[state=closed]:data-[animate-state=done]:hidden",
        )}
      >
        <div className="w-[20vw] overflow-auto scroll-hidden max-h-[40vh]">
          <ul>
            {toc.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`text-gray-400 hover:text-gray-600`}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
};
