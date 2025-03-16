"use client";

import { useTheme } from "next-themes";
import { Button } from "nextra/components";
import { useMounted } from "nextra/hooks";
import { MoonIcon, SunIcon } from "nextra/icons";

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  // TODO: system theme
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const IconToUse = mounted && isDark ? MoonIcon : SunIcon;

  return (
    <Button
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
      className="text-gray-400"
    >
      <IconToUse height="11" />
    </Button>
  );
}
