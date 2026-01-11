import NextLink from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = (props: LinkProps) => {
  return (
    <NextLink {...props} href={props.href || ""} rel="noopener noreferrer" />
  );
};
