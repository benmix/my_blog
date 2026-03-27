import { type ComponentProps, type FC } from "react";
import { cn } from "@lib/utils";
import { Link } from "@components/link";

type MdxLinkProps = ComponentProps<typeof Link> & {
  "data-footnote-backref"?: boolean;
  "data-footnote-ref"?: boolean;
};

export const MdxLink: FC<MdxLinkProps> = ({ className, href, ...props }) => {
  const hrefValue = typeof href === "string" ? href : "";
  const isFootnoteRef = Boolean(props["data-footnote-ref"]);
  const isFootnoteBackref = Boolean(props["data-footnote-backref"]);

  return (
    <Link
      href={href ?? ""}
      className={cn(
        "underline underline-offset-4 transition-colors",
        isFootnoteRef || isFootnoteBackref
          ? "px-0.5 font-sans font-medium text-link decoration-transparent hover:text-link hover:decoration-current"
          : "text-link decoration-link/30 hover:decoration-link",
        hrefValue.startsWith("#") ? "scroll-mt-24" : undefined,
        className,
      )}
      {...props}
    />
  );
};
