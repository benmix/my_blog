import { type ComponentProps, type FC } from "react";

import { cn } from "@lib/utils";

type FootnoteSectionProps = ComponentProps<"section"> & {
  "data-footnotes"?: boolean;
};

export const FootnoteSection: FC<FootnoteSectionProps> = ({ className, children, ...props }) => {
  const isFootnotes = Boolean(props["data-footnotes"]);

  if (!isFootnotes) {
    return (
      <section className={className} {...props}>
        {children}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "mt-20 max-w-[60ch] border-t border-border pt-8 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <h2 className="mb-5 font-mono text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        Footnotes
      </h2>
      <ol className="m-0 list-decimal pl-4 font-sans text-[0.92rem] leading-[1.75] marker:font-mono marker:text-[0.72rem] marker:text-muted-foreground/75 [&>li]:border-t [&>li]:border-border/60 [&>li]:py-4 [&>li:first-child]:border-t-0 [&>li:first-child]:pt-0 [&>li:last-child]:pb-0">
        {children}
      </ol>
    </section>
  );
};
