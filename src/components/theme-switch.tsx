"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { Button } from "nextra/components";
import { useMounted } from "nextra/hooks";

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  // TODO: system theme
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const IconToUse = mounted && isDark ? RiMoonLine : RiSunLine;

  return (
    <Button
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
      className="cursor-pointer text-gray-400"
    >
      <IconToUse size="16" />
    </Button>
  );
}
