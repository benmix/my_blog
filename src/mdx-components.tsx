"use no memo";

import {
  Code,
  Details,
  Pre,
  Summary,
  Table,
  withIcons,
} from "nextra/components";
import { useMDXComponents as getNextraMDXComponents } from "nextra/mdx-components";
import type { MDXComponents } from "nextra/mdx-components";
import { Meta } from "./components/meta";
import { Link } from "./components/Link";
import { Blockquote } from "./components/block-quote";
import { H1, H2, H3, H4, H5, H6 } from "./components/typopraghy-header";
import { Wrapper } from "./components/mdx-wrapper";

const DEFAULT_COMPONENTS = getNextraMDXComponents({
  blockquote: Blockquote,
  code: Code,
  details: Details,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  pre: withIcons(Pre),
  summary: Summary,
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
