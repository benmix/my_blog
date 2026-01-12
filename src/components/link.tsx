import type { ComponentProps } from "react";

import NextLink from "next/link";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = (props: LinkProps) => {
  return <NextLink {...props} href={props.href || ""} rel="noopener noreferrer" />;
};
