import NextLink from "next/link";
import { MDXComponents } from "nextra/mdx-components";

export const Link: Required<MDXComponents>["a"] = (props) => {
  return <NextLink {...props} href={props.href || ""} rel="noopener noreferrer" />;
};
