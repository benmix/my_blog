import type { ComponentType } from "react";
import { Link } from "@components/link";
import { Blockquote } from "@components/block-quote";
import { H2, H3, H4, H5, H6 } from "@components/typopraghy-header";
import { Code } from "@components/code";
import { Pre } from "@components/pre";
import { Table } from "@components/table";

export type MDXComponents = Record<string, ComponentType<any>> & {
  wrapper?: ComponentType<any>;
};

const DEFAULT_COMPONENTS: MDXComponents = {
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

export const useMDXComponents = ({ ...components }: MDXComponents = {}) => ({
  ...DEFAULT_COMPONENTS,
  ...components,
});
