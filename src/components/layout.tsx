import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import type { ComponentProps, FC, ReactNode } from "react";

export const Footer: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <footer className="relative mt-16 flex w-full grow-0 items-center justify-between gap-2 pt-4 pb-8 text-xs max-md:mt-12">
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
        className="relative container mx-auto prose prose-sm flex flex-col max-md:prose-sm max-md:px-4 xl:max-w-[85ch] prose-a:no-underline hover:prose-a:underline"
        dir="ltr"
      >
        <ViewTransitions>{children}</ViewTransitions>
      </main>
    </ThemeProvider>
  );
};
