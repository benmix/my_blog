import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";

import { MDXComponents } from "@/components/mdx-components";
import { Wrapper } from "@/components/mdx-wrapper";
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
import { cn } from "@lib/utils";

type Post = import("content-collections").Post;
type ReactNode = import("react").ReactNode;

type PreviewSectionItem = {
  description: string;
  id: string;
  title: string;
};

type PreviewCardProps = {
  children: ReactNode;
  label: string;
  note?: string;
  syntax?: string;
  wide?: boolean;
};

const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" fill="none">
  <rect width="1200" height="720" fill="#f3efe2"/>
  <path d="M0 510C140 470 220 454 340 450C475 446 563 470 680 496C815 525 929 558 1200 510V720H0V510Z" fill="#ded7c5"/>
  <path d="M0 392C173 333 300 323 424 337C553 351 622 397 734 420C862 447 980 442 1200 369V720H0V392Z" fill="#c8c0af"/>
  <circle cx="928" cy="160" r="64" fill="#b5a98f"/>
  <path d="M208 454H1000" stroke="#3f3a35" stroke-width="3"/>
  <path d="M284 454V262H350C410 262 448 298 448 354C448 412 409 454 350 454H284Z" fill="#3f3a35"/>
  <path d="M496 454V282H560C594 282 620 292 637 311C655 331 664 357 664 390C664 422 655 447 637 467C620 487 594 497 560 497H496" fill="#3f3a35"/>
  <path d="M728 454V262H798" stroke="#3f3a35" stroke-width="40"/>
  <path d="M866 454V262H932C975 262 1008 272 1030 292C1052 312 1063 340 1063 376C1063 412 1052 440 1030 460C1008 480 975 490 932 490H866" fill="#3f3a35"/>
</svg>
`)}`;

const CODE_SAMPLE = `export function composeMorning(issue: string) {
  return {
    headline: "Weather as Public Memory",
    subhead: issue,
    rhythm: ["lead", "pause", "quote", "poetry"],
  };
}`;

const PREVIEW_SECTIONS: PreviewSectionItem[] = [
  {
    description:
      "Wrapper and live MDX regression are isolated here so they do not interfere with atomic component previews.",
    id: "integration",
    title: "Integration",
  },
  {
    description:
      "One card per text component. No composed article specimen, only direct component rendering.",
    id: "typography",
    title: "Typography",
  },
  {
    description:
      "Each inline semantic is previewed on its own instead of being mixed into one paragraph.",
    id: "inline",
    title: "Inline Semantics",
  },
  {
    description:
      "Editorial primitives are rendered one by one so spacing, tone, and hierarchy stay easy to inspect.",
    id: "editorial",
    title: "Editorial Primitives",
  },
  {
    description:
      "Media, lists, tables, and footnotes are grouped only when the subcomponents are inseparable in practice.",
    id: "structure",
    title: "Structure & Reference",
  },
] as const;

function getRegressionPost() {
  return allPosts.reduce<Post | null>((selected, post) => {
    if (!post.mdx) {
      return selected;
    }

    if (!selected) {
      return post;
    }

    return post.content.length < selected.content.length ? post : selected;
  }, null);
}

const regressionPost = getRegressionPost();

function PageSection({
  children,
  description,
  id,
  title,
}: {
  children: ReactNode;
  description: string;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10">
      <div className="mb-8 grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <p className="font-mono text-[0.72rem] tracking-[0.2em] text-muted-foreground uppercase">
          {title}
        </p>
        <p className="max-w-[56ch] font-sans text-[0.98rem] leading-[1.74] text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function PreviewGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-8 lg:grid-cols-2", className)}>{children}</div>;
}

function PreviewCard({ children, label, note, syntax, wide = false }: PreviewCardProps) {
  return (
    <section
      className={cn(
        "min-w-0 border border-border/70 bg-background px-5 py-5",
        wide && "lg:col-span-2",
      )}
    >
      <header className="mb-5 flex flex-col gap-2 border-b border-border/70 pb-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="space-y-2">
          <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
            {label}
          </p>
          {note ? (
            <p className="max-w-[44ch] font-sans text-[0.92rem] leading-[1.66] text-muted-foreground">
              {note}
            </p>
          ) : null}
        </div>
        {syntax ? (
          <p className="shrink-0 font-mono text-[0.7rem] leading-5 text-muted-foreground">
            {syntax}
          </p>
        ) : null}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Syntax({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto border border-border/80 bg-background px-5 py-4 font-mono text-[0.8rem] leading-6 text-muted-foreground">
      <code>{children}</code>
    </pre>
  );
}

function PreviewRail({ items }: { items: PreviewSectionItem[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 border-l border-border pl-5">
        <p className="mb-4 font-mono text-[0.72rem] tracking-[0.2em] text-muted-foreground uppercase">
          Preview Index
        </p>
        <nav className="space-y-5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block transition-colors hover:text-foreground"
            >
              <span className="block font-sans text-[0.95rem] leading-[1.4] text-foreground">
                {item.title}
              </span>
              <span className="mt-1 block font-sans text-[0.84rem] leading-[1.5] text-muted-foreground">
                {item.description}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function OverviewStrip() {
  return (
    <div className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4">
        <Kicker>Component Preview Page</Kicker>
        <H1 className="mb-0 max-w-[12ch] text-[3.25rem] md:text-[5rem]">MDX Component Atlas</H1>
        <Subhead className="mb-0 max-w-[46ch]">
          This page renders the current MDX component system as an atomic preview catalog. Each card
          focuses on one component, or on one inseparable component group.
        </Subhead>
      </div>
      <div className="border-l border-border pl-5">
        <p className="mb-3 font-mono text-[0.72rem] tracking-[0.2em] text-muted-foreground uppercase">
          Goal
        </p>
        <p className="font-sans text-[0.95rem] leading-[1.7] text-muted-foreground">
          Inspect typography, spacing, and structure without reading through a composed article
          specimen. Integration previews stay isolated below.
        </p>
      </div>
    </div>
  );
}

function WrapperPreview() {
  const metadata = regressionPost ?? allPosts[0];

  if (!metadata) {
    return (
      <Annotation label="Unavailable">
        No post metadata was available, so the wrapper preview could not be rendered.
      </Annotation>
    );
  }

  return (
    <Wrapper
      currentPath="/zh/markdown-design-system"
      locale="zh"
      metadata={metadata}
      variant="embedded"
    >
      <Kicker>Wrapper Preview</Kicker>
      <H2 className="mt-0">A Quiet Reading Surface</H2>
      <Paragraph>
        This preview exists only to show the wrapper, heading stack, and prose measure in a
        controlled context. It should feel calm and stable before any richer content appears.
      </Paragraph>
      <Aside tone="inline">
        Wrapper preview uses embedded mode so the page chrome does not repeat inside the catalog.
      </Aside>
    </Wrapper>
  );
}

function RegressionPreview() {
  if (!regressionPost) {
    return (
      <Annotation label="Unavailable">
        No compiled MDX post was found in <code>content-collections</code>, so the regression
        specimen could not be rendered.
      </Annotation>
    );
  }

  return (
    <div className="space-y-8">
      <Aside className="my-0 ml-0 max-w-[44ch]" tone="inline">
        Rendering sample: <span className="text-foreground">{regressionPost.title}</span> from{" "}
        <code>{`/posts/${regressionPost._meta.path}`}</code>. This block runs through the same
        wrapper and MDX component map used by the live article page.
      </Aside>
      <Wrapper
        currentPath={`/zh/posts/${regressionPost._meta.path}`}
        locale="zh"
        metadata={regressionPost}
        variant="embedded"
      >
        <MDXContent code={regressionPost.mdx} components={MDXComponents} />
      </Wrapper>
    </div>
  );
}

function FigurePreview() {
  return (
    <Figure>
      <Image alt="Editorial placeholder landscape" src={PLACEHOLDER_IMAGE} />
      <Figcaption>
        South alley before the buses arrived. The image is intentionally quiet so the caption keeps
        the rhetorical weight.
      </Figcaption>
    </Figure>
  );
}

function TablePreview() {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Element</Table.Th>
          <Table.Th>Measure</Table.Th>
          <Table.Th>Use</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Headline</Table.Td>
          <Table.Td>12-16ch</Table.Td>
          <Table.Td>Compressed authority</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Body</Table.Td>
          <Table.Td>60-68ch</Table.Td>
          <Table.Td>Sustained reading</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Poetry</Table.Td>
          <Table.Td>24-32ch</Table.Td>
          <Table.Td>Intentional line breaks</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}

function DefinitionPreview() {
  return (
    <DefinitionList>
      <div>
        <DefinitionTerm>Measure</DefinitionTerm>
        <DefinitionDescription>
          The readable width of a line, used here as a structural choice rather than a cosmetic one.
        </DefinitionDescription>
      </div>
      <div>
        <DefinitionTerm>Silence</DefinitionTerm>
        <DefinitionDescription>
          Empty vertical space that implies pause, scene change, or withheld emphasis.
        </DefinitionDescription>
      </div>
    </DefinitionList>
  );
}

function OrderedListPreview() {
  return (
    <OrderedList>
      <ListItem>Establish a clear headline.</ListItem>
      <ListItem>Open with a lead that controls pace.</ListItem>
      <ListItem>Use one deliberate interruption.</ListItem>
    </OrderedList>
  );
}

function UnorderedListPreview() {
  return (
    <UnorderedList>
      <ListItem>Caption stays close to the image.</ListItem>
      <ListItem>Poetry stays narrow.</ListItem>
      <ListItem>Rules separate scenes, not widgets.</ListItem>
    </UnorderedList>
  );
}

function TaskListPreview() {
  return (
    <UnorderedList className="contains-task-list">
      <ListItem className="task-list-item">
        <Checkbox checked readOnly type="checkbox" />
        Establish hierarchy
      </ListItem>
      <ListItem className="task-list-item">
        <Checkbox checked readOnly type="checkbox" />
        Preserve semantics
      </ListItem>
      <ListItem className="task-list-item">
        <Checkbox readOnly type="checkbox" />
        Add directive parser
      </ListItem>
    </UnorderedList>
  );
}

function CodePreview() {
  return (
    <Pre data-copy="" data-filename="rhythm.ts">
      <Code className="language-ts">{CODE_SAMPLE}</Code>
    </Pre>
  );
}

function FootnotePreview() {
  return (
    <FootnoteSection data-footnotes id="preview-footnotes">
      <li id="preview-fn-1">
        Editorial type systems often fail when they treat annotation as metadata instead of part of
        the reading rhythm.{" "}
        <MdxLink data-footnote-backref href="#preview-fnref-1">
          ↩︎
        </MdxLink>
      </li>
      <li id="preview-fn-2">
        This page renders the actual MDX components rather than screenshots of them.{" "}
        <MdxLink data-footnote-backref href="#preview-fnref-2">
          ↩︎
        </MdxLink>
      </li>
    </FootnoteSection>
  );
}

function InlineExample({ children, sentence }: { children: ReactNode; sentence: ReactNode }) {
  return (
    <Paragraph className="mb-0">
      {sentence} {children}
    </Paragraph>
  );
}

export function MarkdownDesignSystem() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-[1280px] px-6 py-10 md:px-10 md:py-16">
        <OverviewStrip />

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="space-y-16">
            <PageSection
              description="Only the wrapper and the live MDX pipeline live here. They remain isolated from atomic component inspection."
              id="integration"
              title="Integration"
            >
              <PreviewGrid className="lg:grid-cols-1">
                <PreviewCard
                  label="Wrapper"
                  note="A minimal wrapper preview with controlled child content."
                  syntax="Wrapper"
                  wide
                >
                  <WrapperPreview />
                </PreviewCard>
                <PreviewCard
                  label="Production MDX Regression"
                  note="A real compiled post rendered through MDXContent, MDXComponents, and Wrapper."
                  syntax="MDXContent + MDXComponents + Wrapper"
                  wide
                >
                  <RegressionPreview />
                </PreviewCard>
              </PreviewGrid>
            </PageSection>

            <PageSection
              description="Each text component renders in its own card so hierarchy and spacing can be inspected without interference."
              id="typography"
              title="Typography"
            >
              <PreviewGrid>
                <PreviewCard label="Kicker" syntax="::kicker">
                  <Kicker>City Desk</Kicker>
                </PreviewCard>
                <PreviewCard label="Headline / H1" syntax="# Headline">
                  <H1 id="preview-h1">Weather as Public Memory</H1>
                </PreviewCard>
                <PreviewCard label="Subhead" syntax="::subhead">
                  <Subhead className="mb-0">
                    A secondary line that extends the thesis without competing with the title.
                  </Subhead>
                </PreviewCard>
                <PreviewCard label="Lead" syntax="::lead">
                  <Lead className="mb-0">
                    The lead opens a page in a larger, calmer voice and tells the reader how quickly
                    to breathe.
                  </Lead>
                </PreviewCard>
                <PreviewCard label="Paragraph" syntax="p">
                  <Paragraph className="mb-0">
                    Long-form paragraphs should feel steady, measured, and unhurried. This preview
                    isolates the base prose voice without any ornamental interruption.
                  </Paragraph>
                </PreviewCard>
                <PreviewCard label="DropCap" syntax="::drop-cap">
                  <DropCap className="mb-0">
                    Pages become memorable when the opening sentence has both weight and room. The
                    drop cap is not ornament for its own sake; it is an entrance cue.
                  </DropCap>
                </PreviewCard>
                <PreviewCard label="Section Heading / H2" syntax="## Section">
                  <H2 id="preview-h2">Section Breaks Need Real Weight</H2>
                </PreviewCard>
                <PreviewCard label="Subsection / H3" syntax="### Subsection">
                  <H3 id="preview-h3">Subsections Narrow the Argument</H3>
                </PreviewCard>
                <PreviewCard label="Minor Heading / H4" syntax="#### Minor Heading">
                  <H4 id="preview-h4">Minor headings behave like editor notes.</H4>
                </PreviewCard>
                <PreviewCard label="Label Heading / H5" syntax="##### Label Heading">
                  <H5 id="preview-h5">Field Notes</H5>
                </PreviewCard>
                <PreviewCard label="Micro Heading / H6" syntax="###### Micro Label">
                  <H6 id="preview-h6">Archive Ref</H6>
                </PreviewCard>
              </PreviewGrid>
            </PageSection>

            <PageSection
              description="Inline semantics are previewed separately so each treatment can be checked without crowding one sentence."
              id="inline"
              title="Inline Semantics"
            >
              <PreviewGrid>
                <PreviewCard label="Strong" syntax="**strong**">
                  <InlineExample sentence="Weight should come from one chosen phrase, not the whole line.">
                    <Strong>Strong emphasis lives here.</Strong>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Emphasis" syntax="*emphasis*">
                  <InlineExample sentence="A sentence can bend in tone without changing its volume.">
                    <Emphasis>Emphasis introduces that slight turn.</Emphasis>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Delete" syntax="~~delete~~">
                  <InlineExample sentence="Editorial voice sometimes works by subtraction.">
                    <Delete>This clause is struck through on purpose.</Delete>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Mark" syntax="==mark==">
                  <InlineExample sentence="Selective highlighting should feel like annotation, not a banner.">
                    <Mark>This phrase carries the mark treatment.</Mark>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Inline Code" syntax="`code`">
                  <InlineExample sentence="Technical prose needs a neutral inline code voice.">
                    <Code>composeMorning()</Code>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Keyboard" syntax="<kbd>">
                  <InlineExample sentence="Keycaps should stay compact and low-noise inside prose.">
                    <Keyboard>Shift</Keyboard>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Subscript" syntax="<sub>">
                  <InlineExample sentence="Scientific notation should not disturb the reading line.">
                    H<Subscript>2</Subscript>O
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Superscript" syntax="<sup>">
                  <InlineExample sentence="Superscript belongs to the text flow, not outside it.">
                    E = mc<Superscript>2</Superscript>
                  </InlineExample>
                </PreviewCard>
                <PreviewCard label="Link" syntax="[link](#preview-footnotes)">
                  <InlineExample sentence="Links should still read like prose when they appear inside a paragraph.">
                    <MdxLink href="#preview-footnotes">Visit the note section</MdxLink>
                  </InlineExample>
                </PreviewCard>
              </PreviewGrid>
            </PageSection>

            <PageSection
              description="Each editorial primitive sits alone so its layout meaning stays legible."
              id="editorial"
              title="Editorial Primitives"
            >
              <PreviewGrid>
                <PreviewCard label="Blockquote" syntax="> quote">
                  <Blockquote>
                    <Paragraph className="mb-0">
                      A quotation should feel lifted from the page rather than boxed away from it.
                    </Paragraph>
                  </Blockquote>
                </PreviewCard>
                <PreviewCard label="PullQuote" syntax="::pull-quote">
                  <PullQuote attribution="Morning Notebook">
                    The quote should interrupt the page like weather, not like a widget.
                  </PullQuote>
                </PreviewCard>
                <PreviewCard label="Poetry" syntax="::poetry">
                  <Poetry className="my-0">
                    <PoetryBody>{`A narrow line
keeps faith with pause
and with the hand
that placed it there`}</PoetryBody>
                  </Poetry>
                </PreviewCard>
                <PreviewCard label="Aside" syntax="::aside">
                  <Aside className="my-0">
                    Marginal notes should read like lowered volume, not like system alerts.
                  </Aside>
                </PreviewCard>
                <PreviewCard label="MarginNote" syntax="::margin-note">
                  <div className="max-w-[68ch]">
                    <Paragraph>
                      Margin notes belong at the edge of the argument. They should interrupt
                      spatially, not emotionally.
                    </Paragraph>
                    <MarginNote>
                      On wide screens this note leaves the prose column and becomes part of the page
                      margin.
                    </MarginNote>
                    <Paragraph className="mb-0">
                      On smaller screens it falls back inline and keeps the same quiet voice.
                    </Paragraph>
                  </div>
                </PreviewCard>
                <PreviewCard label="Annotation" syntax="::annotation">
                  <Annotation label="Context">
                    An annotation is compact and factual, but it still belongs to the rhythm of the
                    page.
                  </Annotation>
                </PreviewCard>
                <PreviewCard label="Divider" syntax="::divider">
                  <Divider glyph="section" />
                </PreviewCard>
                <PreviewCard label="HorizontalRule" syntax="---">
                  <HorizontalRule />
                </PreviewCard>
                <PreviewCard label="Silence" syntax='::silence{size="m"}'>
                  <div className="border border-dashed border-border px-4 py-3">
                    <p className="m-0 font-mono text-xs text-muted-foreground">before</p>
                    <Silence size="m" />
                    <p className="m-0 font-mono text-xs text-muted-foreground">after</p>
                  </div>
                </PreviewCard>
                <PreviewCard label="Breath" syntax='::breath{size="l"}'>
                  <div className="border border-dashed border-border px-4 py-3">
                    <p className="m-0 font-mono text-xs text-muted-foreground">before</p>
                    <Breath size="l" />
                    <p className="m-0 font-mono text-xs text-muted-foreground">after</p>
                  </div>
                </PreviewCard>
                <PreviewCard
                  label="Columns + Column"
                  note="This stays grouped because the child columns are not meaningful without the parent layout."
                  syntax="::columns / :::column"
                  wide
                >
                  <Columns layout="prose-aside">
                    <Column span="prose">
                      <Paragraph className="mb-0">
                        A multi-column block should mean something: contrast, interruption, or a
                        second register of reading.
                      </Paragraph>
                    </Column>
                    <Column span="aside">
                      <Aside className="my-0 ml-0">
                        The right column can hold commentary without turning the layout into cards.
                      </Aside>
                    </Column>
                  </Columns>
                </PreviewCard>
              </PreviewGrid>
            </PageSection>

            <PageSection
              description="These previews stay close to the real document structures they represent. Some are grouped because their subparts are semantically inseparable."
              id="structure"
              title="Structure & Reference"
            >
              <PreviewGrid>
                <PreviewCard label="Image" syntax="img">
                  <Image alt="Editorial placeholder landscape" src={PLACEHOLDER_IMAGE} />
                </PreviewCard>
                <PreviewCard
                  label="Figure + Figcaption"
                  note="Figure and caption stay together because the caption depends on the media context."
                  syntax="figure / figcaption"
                >
                  <FigurePreview />
                </PreviewCard>
                <PreviewCard label="FigureWithCaption" syntax="::figure">
                  <FigureWithCaption
                    alt="Editorial placeholder landscape"
                    caption="A single-call figure primitive for directive-based authoring."
                    src={PLACEHOLDER_IMAGE}
                  />
                </PreviewCard>
                <PreviewCard label="OrderedList + ListItem" syntax="ol / li">
                  <OrderedListPreview />
                </PreviewCard>
                <PreviewCard label="UnorderedList + ListItem" syntax="ul / li">
                  <UnorderedListPreview />
                </PreviewCard>
                <PreviewCard
                  label="Task List + Checkbox"
                  syntax="input[type=checkbox]"
                  note="Checkbox is previewed inside the task-list structure where it is actually used."
                >
                  <TaskListPreview />
                </PreviewCard>
                <PreviewCard
                  label="DefinitionList + DefinitionTerm + DefinitionDescription"
                  syntax="dl / dt / dd"
                >
                  <DefinitionPreview />
                </PreviewCard>
                <PreviewCard label="Pre + Code" syntax="```ts" wide>
                  <CodePreview />
                </PreviewCard>
                <PreviewCard label="Table + Thead + Tbody + Tr + Th + Td" syntax="table" wide>
                  <TablePreview />
                </PreviewCard>
                <PreviewCard
                  label="FootnoteSection + MdxLink"
                  note="Uses isolated preview ids so footnote refs do not collide with page anchors."
                  syntax="section[data-footnotes]"
                  wide
                >
                  <Paragraph>
                    Notes should stay in the document voice, even when they move to the bottom of
                    the page. See note{" "}
                    <MdxLink data-footnote-ref href="#preview-fn-1" id="preview-fnref-1">
                      1
                    </MdxLink>{" "}
                    and note{" "}
                    <MdxLink data-footnote-ref href="#preview-fn-2" id="preview-fnref-2">
                      2
                    </MdxLink>
                    .
                  </Paragraph>
                  <FootnotePreview />
                </PreviewCard>
                <PreviewCard label="Syntax Block Helper" syntax="raw preview helper">
                  <Syntax>{`::poetry
Rain on iron
light in glass
::
`}</Syntax>
                </PreviewCard>
              </PreviewGrid>
            </PageSection>
          </div>

          <PreviewRail items={PREVIEW_SECTIONS} />
        </div>
      </main>
    </div>
  );
}
