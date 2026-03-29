import { Annotation } from "@/components/mdx/annotation";
import { Aside } from "@/components/mdx/aside";
import { Blockquote } from "@/components/mdx/blockquote";
import { Code } from "@/components/mdx/code";
import { Column } from "@/components/mdx/column";
import { Columns } from "@/components/mdx/columns";
import { DefinitionDescription } from "@/components/mdx/definition";
import { DefinitionList } from "@/components/mdx/definition";
import { DefinitionTerm } from "@/components/mdx/definition";
import { Divider } from "@/components/mdx/divider";
import { DropCap } from "@/components/mdx/drop-cap";
import { Figcaption } from "@/components/mdx/figcaption";
import { Figure } from "@/components/mdx/figure";
import { FigureWithCaption } from "@/components/mdx/figure-with-caption";
import { FootnoteSection } from "@/components/mdx/footnote-section";
import { H1 } from "@/components/mdx/headings";
import { H2 } from "@/components/mdx/headings";
import { H3 } from "@/components/mdx/headings";
import { H4 } from "@/components/mdx/headings";
import { H5 } from "@/components/mdx/headings";
import { H6 } from "@/components/mdx/headings";
import { HorizontalRule } from "@/components/mdx/horizontal-rule";
import { Image } from "@/components/mdx/image";
import { Delete } from "@/components/mdx/inline-semantics";
import { Emphasis } from "@/components/mdx/inline-semantics";
import { Strong } from "@/components/mdx/inline-semantics";
import { Subscript } from "@/components/mdx/inline-semantics";
import { Superscript } from "@/components/mdx/inline-semantics";
import { Keyboard } from "@/components/mdx/keyboard";
import { Kicker } from "@/components/mdx/kicker";
import { Lead } from "@/components/mdx/lead";
import { Checkbox } from "@/components/mdx/list";
import { ListItem } from "@/components/mdx/list";
import { OrderedList } from "@/components/mdx/list";
import { UnorderedList } from "@/components/mdx/list";
import { MarginNote } from "@/components/mdx/margin-note";
import { Mark } from "@/components/mdx/mark";
import { MdxLink } from "@/components/mdx/mdx-link";
import { Paragraph } from "@/components/mdx/paragraph";
import { Poetry } from "@/components/mdx/poetry";
import { PoetryBody } from "@/components/mdx/poetry-body";
import { Pre } from "@/components/mdx/pre";
import { PullQuote } from "@/components/mdx/pull-quote";
import { Breath } from "@/components/mdx/spacing";
import { Silence } from "@/components/mdx/spacing";
import { Subhead } from "@/components/mdx/subhead";
import { Table } from "@/components/mdx/table";

export type MDXComponents = Record<string, import("react").ComponentType<any>> & {
  wrapper?: import("react").ComponentType<any>;
};

export const MDXComponents: MDXComponents = {
  Annotation,
  Aside,
  Breath,
  Column,
  Columns,
  Divider,
  DropCap,
  FigureWithCaption,
  Kicker,
  Lead,
  MarginNote,
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
  Poetry,
  PoetryBody,
  pre: Pre,
  PullQuote,
  Silence,
  section: FootnoteSection,
  strong: Strong,
  sub: Subscript,
  Subhead,
  sup: Superscript,
  table: Table,
  tbody: Table.Tbody,
  td: Table.Td,
  thead: Table.Thead,
  th: Table.Th,
  tr: Table.Tr,
  ul: UnorderedList,
};
