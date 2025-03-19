import { useMDXComponents as getNextraMDXComponents } from "nextra/mdx-components";
import type { MDXComponents } from "nextra/mdx-components";
import { Link } from "@components/link";
import { Blockquote } from "@components//block-quote";
import { H2, H3, H4, H5, H6 } from "@components//typopraghy-header";
import { Wrapper } from "@components//mdx-wrapper";
import { Code } from "@components/code";
import { Pre } from "@components/pre";
import { Table } from "@components/table";

const DEFAULT_COMPONENTS = getNextraMDXComponents({
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
  wrapper: Wrapper,
});

export const useMDXComponents = ({ ...components }: MDXComponents = {}) =>
  ({
    ...DEFAULT_COMPONENTS,
    ...components,
  }) satisfies MDXComponents;
