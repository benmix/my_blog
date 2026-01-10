"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startViewTransition = (document as any).startViewTransition?.bind(document);

    if (!startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const endRadius = Math.hypot(maxX, maxY);

    const root = document.documentElement;
    root.dataset.themeTransition = "1";
    root.style.setProperty("--theme-transition-x", `${x}px`);
    root.style.setProperty("--theme-transition-y", `${y}px`);
    root.style.setProperty("--theme-transition-end-radius", `${endRadius}px`);

    const transition = startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeTransition;
    });
  };

  const IconToUse = mounted && isDark ? RiMoonLine : RiSunLine;

  return (
    <Button
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:bg-transparent hover:text-foreground"
    >
      <IconToUse size="16" />
    </Button>
  );
}
