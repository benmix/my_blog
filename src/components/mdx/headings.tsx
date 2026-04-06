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
      tone="mt-12 mb-5 max-w-[24ch] scroll-mt-24 font-serif text-[1.08rem] leading-[1.3] font-semibold tracking-[-0.012em] text-balance text-foreground md:text-[1.28rem]"
    />
  );
}

export function H2(props: ComponentProps<"h2">) {
  return (
    <HeadingFrame
      {...props}
      tag="h2"
      tone="mt-12 mb-5 max-w-[24ch] scroll-mt-24 border-t border-border pt-4 font-serif text-[1.02rem] leading-[1.32] font-semibold tracking-[-0.01em] text-balance text-foreground md:text-[1.2rem]"
    />
  );
}

export function H3(props: ComponentProps<"h3">) {
  return (
    <HeadingFrame
      {...props}
      tag="h3"
      tone="mt-10 mb-4 max-w-[24ch] scroll-mt-24 font-serif text-[0.98rem] leading-[1.34] font-semibold tracking-[-0.008em] text-balance text-foreground md:text-[1.12rem]"
    />
  );
}

export function H4(props: ComponentProps<"h4">) {
  return (
    <HeadingFrame
      {...props}
      tag="h4"
      tone="mt-8 mb-3 max-w-[28ch] scroll-mt-24 font-serif text-[0.92rem] leading-[1.4] font-semibold text-foreground"
    />
  );
}

export function H5(props: ComponentProps<"h5">) {
  return (
    <HeadingFrame
      {...props}
      tag="h5"
      tone="mt-7 mb-3 scroll-mt-24 font-sans text-[0.82rem] leading-[1.42] font-semibold tracking-[0.08em] text-foreground uppercase"
    />
  );
}

export function H6(props: ComponentProps<"h6">) {
  return (
    <HeadingFrame
      {...props}
      tag="h6"
      tone="mt-6 mb-3 scroll-mt-24 font-mono text-[0.72rem] leading-[1.38] font-medium tracking-[0.16em] text-muted-foreground uppercase"
    />
  );
}
