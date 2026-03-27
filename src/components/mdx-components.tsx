import type * as React from "react";
import { Blockquote } from "@/components/mdx/blockquote";
import { Checkbox } from "@/components/mdx/checkbox";
import { Code } from "@/components/mdx/code";
import { DefinitionDescription } from "@/components/mdx/definition-description";
import { DefinitionList } from "@/components/mdx/definition-list";
import { DefinitionTerm } from "@/components/mdx/definition-term";
import { Delete } from "@/components/mdx/delete";
import { Emphasis } from "@/components/mdx/emphasis";
import { Figcaption } from "@/components/mdx/figcaption";
import { Figure } from "@/components/mdx/figure";
import { FootnoteSection } from "@/components/mdx/footnote-section";
import { H1 } from "@/components/mdx/h1";
import { H2 } from "@/components/mdx/h2";
import { H3 } from "@/components/mdx/h3";
import { H4 } from "@/components/mdx/h4";
import { H5 } from "@/components/mdx/h5";
import { H6 } from "@/components/mdx/h6";
import { HorizontalRule } from "@/components/mdx/horizontal-rule";
import { Image } from "@/components/mdx/image";
import { Keyboard } from "@/components/mdx/keyboard";
import { ListItem } from "@/components/mdx/list-item";
import { Mark } from "@/components/mdx/mark";
import { MdxLink } from "@/components/mdx/mdx-link";
import { OrderedList } from "@/components/mdx/ordered-list";
import { Paragraph } from "@/components/mdx/paragraph";
import { Pre } from "@/components/mdx/pre";
import { Strong } from "@/components/mdx/strong";
import { Subscript } from "@/components/mdx/subscript";
import { Superscript } from "@/components/mdx/superscript";
import { Table } from "@/components/mdx/table";
import { UnorderedList } from "@/components/mdx/unordered-list";

export type MDXComponents = Record<string, React.ComponentType<any>> & {
  wrapper?: React.ComponentType<any>;
};

export const MDXComponents: MDXComponents = {
  a: MdxLink,
  blockquote: Blockquote,
  code: Code,
  dd: DefinitionDescription,
  del: Delete,
  dl: DefinitionList,
  dt: DefinitionTerm,
  em: Emphasis,
  figcaption: Figcaption,
  figure: Figure,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  h1: H1,
  hr: HorizontalRule,
  img: Image,
  input: Checkbox,
  kbd: Keyboard,
  li: ListItem,
  mark: Mark,
  ol: OrderedList,
  p: Paragraph,
  pre: Pre,
  section: FootnoteSection,
  strong: Strong,
  sub: Subscript,
  sup: Superscript,
  table: Table,
  tbody: Table.Tbody,
  td: Table.Td,
  thead: Table.Thead,
  th: Table.Th,
  tr: Table.Tr,
  ul: UnorderedList,
};
