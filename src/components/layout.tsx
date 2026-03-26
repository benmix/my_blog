import type { ComponentProps, FC, ReactNode } from "react";
import { cn } from "@lib/utils";
import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";

export const Footer: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return <footer className="relative mt-auto w-full">{children}</footer>;
};

export const Content: FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <main className={cn("grow", className)}>{children}</main>;
};

export const Layout: FC<{
  children: ReactNode;
  nextThemes?: Omit<ComponentProps<typeof ThemeProvider>, "children">;
}> = ({ children, nextThemes }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...nextThemes}>
      <div className="relative flex min-h-screen flex-col" dir="ltr">
        <ViewTransitions>{children}</ViewTransitions>
      </div>
    </ThemeProvider>
  );
};
