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
    <section className={cn("max-w-4xl pt-4", className)} {...props}>
      <h2 className="mb-3 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Footnotes
      </h2>
      <ol className="m-0 list-decimal space-y-2 pl-4 font-serif text-sm text-muted-foreground marker:font-sans marker:text-muted-foreground/70">
        {children}
      </ol>
    </section>
  );
};
