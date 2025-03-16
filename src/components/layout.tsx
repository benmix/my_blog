import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import type { ComponentProps, FC, ReactNode } from "react";

export const Footer: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <footer className="relative w-full grow-0 flex gap-2 text-xs pt-4 justify-between pb-8">
      {children}
    </footer>
  );
};

export const Content: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return <div className="grow-1">{children}</div>;
};

export const Layout: FC<{
  children: ReactNode;
  nextThemes?: Omit<ComponentProps<typeof ThemeProvider>, "children">;
}> = ({ children, nextThemes }) => {
  return (
    <ThemeProvider attribute="class" {...nextThemes}>
      <main
        className="container mx-auto flex flex-col relative prose max-md:prose-sm dark:prose-invert prose-zinc prose-sm"
        dir="ltr"
      >
        <ViewTransitions>{children}</ViewTransitions>
      </main>
    </ThemeProvider>
  );
};
