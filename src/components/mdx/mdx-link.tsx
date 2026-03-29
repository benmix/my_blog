import { type ComponentProps, type FC } from "react";

import { Link } from "@components/link";
import { cn } from "@lib/utils";

type MdxLinkProps = ComponentProps<typeof Link> & {
  "data-footnote-backref"?: boolean;
  "data-footnote-ref"?: boolean;
};

export const MdxLink: FC<MdxLinkProps> = ({ className, href, ...props }) => {
  const isFootnoteRef = Boolean(props["data-footnote-ref"]);
  const isFootnoteBackref = Boolean(props["data-footnote-backref"]);

  return (
    <Link
      href={href ?? ""}
      className={cn(
        "underline decoration-1 underline-offset-[0.18em] transition-colors",
        isFootnoteRef
          ? "px-0.5 font-sans font-medium text-link decoration-transparent hover:text-link hover:decoration-current"
          : isFootnoteBackref
            ? "px-0.5 font-mono text-[0.78rem] font-medium tracking-[0.02em] text-link decoration-transparent hover:text-link hover:decoration-current"
            : "text-link decoration-link/35 hover:decoration-link",
        className,
      )}
      {...props}
    />
  );
};
