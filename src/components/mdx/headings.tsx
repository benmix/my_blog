import type { ComponentProps, ElementType, ReactNode } from "react";

import { HeadingPermalink } from "@/components/mdx/heading-permalink";
import { cn } from "@lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingFrameProps<TTag extends HeadingTag> = ComponentProps<TTag> & {
  children?: ReactNode;
  className?: string;
  id?: string;
  tag: TTag;
  tone: string;
};

function HeadingFrame<TTag extends HeadingTag>({
  children,
  className,
  id,
  tag,
  tone,
  ...props
}: HeadingFrameProps<TTag>) {
  const Comp = tag as ElementType;

  return (
    <Comp id={id} className={cn("group", tone, className)} {...props}>
      {children}
      <HeadingPermalink id={id} />
    </Comp>
  );
}

export function H1(props: ComponentProps<"h1">) {
  return (
    <HeadingFrame
      {...props}
      tag="h1"
      tone="mb-7 max-w-[11ch] scroll-mt-24 font-serif text-[2.85rem] leading-[0.92] font-bold tracking-[-0.045em] text-balance text-foreground md:text-[4.9rem]"
    />
  );
}

export function H2(props: ComponentProps<"h2">) {
  return (
    <HeadingFrame
      {...props}
      tag="h2"
      tone="mt-[4.5rem] mb-7 max-w-[17ch] scroll-mt-24 border-t border-border pt-5 font-serif text-[1.95rem] leading-[1.02] font-semibold tracking-[-0.028em] text-balance text-foreground md:mt-20 md:text-[2.6rem]"
    />
  );
}

export function H3(props: ComponentProps<"h3">) {
  return (
    <HeadingFrame
      {...props}
      tag="h3"
      tone="mt-12 mb-5 max-w-[22ch] scroll-mt-24 font-serif text-[1.38rem] leading-[1.16] font-semibold tracking-[-0.018em] text-balance text-foreground md:text-[1.72rem]"
    />
  );
}

export function H4(props: ComponentProps<"h4">) {
  return (
    <HeadingFrame
      {...props}
      tag="h4"
      tone="mt-10 mb-4 max-w-[30ch] scroll-mt-24 font-serif text-[1.25rem] leading-[1.3] font-semibold text-foreground"
    />
  );
}

export function H5(props: ComponentProps<"h5">) {
  return (
    <HeadingFrame
      {...props}
      tag="h5"
      tone="mt-8 mb-3 scroll-mt-24 font-sans text-[0.95rem] leading-[1.45] font-semibold tracking-[0.1em] text-foreground uppercase"
    />
  );
}

export function H6(props: ComponentProps<"h6">) {
  return (
    <HeadingFrame
      {...props}
      tag="h6"
      tone="mt-6 mb-3 scroll-mt-24 font-mono text-[0.75rem] leading-[1.4] font-medium tracking-[0.18em] text-muted-foreground uppercase"
    />
  );
}
