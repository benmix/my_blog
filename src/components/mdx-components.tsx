import { Blockquote } from "@components/block-quote";
import { Code } from "@components/code";
import { Link } from "@components/link";
import { Pre } from "@components/pre";
import { Table } from "@components/table";
import { H2, H3, H4, H5, H6 } from "@components/typopraghy-header";
import type { ComponentType } from "react";

export type MDXComponents = Record<string, ComponentType<any>> & {
  wrapper?: ComponentType<any>;
};

export const MDXComponents: MDXComponents = {
  blockquote: Blockquote,
  code: Code,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  pre: Pre,
  table: Table,
  td: Table.Td,
  th: Table.Th,
  tr: Table.Tr,
  a: Link,
};
