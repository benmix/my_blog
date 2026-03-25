import type { ComponentProps } from "react";
import { getSecureRel } from "@lib/link-rel";
import NextLink from "next/link";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = (props: LinkProps) => {
  const { rel, target, ...rest } = props;
  return (
    <NextLink {...rest} href={props.href || ""} target={target} rel={getSecureRel(target, rel)} />
  );
};
