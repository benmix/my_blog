import { Blockquote } from "@/components/mdx/blockquote";
import { Code } from "@/components/mdx/code";
import { DefinitionDescription } from "@/components/mdx/definition-description";
import { DefinitionList } from "@/components/mdx/definition-list";
import { DefinitionTerm } from "@/components/mdx/definition-term";
import { Delete } from "@/components/mdx/delete";
import { Emphasis } from "@/components/mdx/emphasis";
import { Figcaption } from "@/components/mdx/figcaption";
import { Figure } from "@/components/mdx/figure";
import { H1 } from "@/components/mdx/h1";
import { H2 } from "@/components/mdx/h2";
import { H3 } from "@/components/mdx/h3";
import { H4 } from "@/components/mdx/h4";
import { H5 } from "@/components/mdx/h5";
import { H6 } from "@/components/mdx/h6";
import { HorizontalRule } from "@/components/mdx/horizontal-rule";
import { Keyboard } from "@/components/mdx/keyboard";
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

function GuideIcon({ path }: { path: string }) {
  return (
    <svg
      className="h-6 w-6 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function GuideSection({
  children,
  iconPath,
  title,
}: {
  children: React.ReactNode;
  iconPath: string;
  title: string;
}) {
  return (
    <section>
      <div className="mb-8 border-b-2 border-foreground pb-4">
        <h3 className="flex items-center gap-3 font-sans text-2xl font-bold tracking-[0.18em] text-foreground uppercase">
          <GuideIcon path={iconPath} />
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function PreviewItem({
  children,
  label,
  spec,
}: {
  children: React.ReactNode;
  label: string;
  spec: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        <span className="rounded border border-border bg-card px-2 py-1 font-mono text-xs text-muted-foreground">
          {spec}
        </span>
      </div>
      {children}
    </div>
  );
}

function PreviewCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function PlaceholderImage() {
  return (
    <div className="mb-3 flex h-48 w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-200 shadow-inner">
      <svg
        className="h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function TaskListPreview() {
  const items = [
    { checked: true, label: "Initialize project repository" },
    { checked: true, label: "Configure Tailwind CSS" },
    { checked: false, label: "Design typography scale" },
    { checked: false, label: "Implement responsive layouts" },
  ];

  return (
    <ul className="m-0 list-none space-y-6 p-0">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-start gap-3 font-serif text-lg leading-relaxed text-foreground"
        >
          <input
            type="checkbox"
            checked={item.checked}
            readOnly
            aria-hidden="true"
            tabIndex={-1}
            className="mt-[0.22em] h-[1em] w-[1em] shrink-0 rounded-[0.12em] border border-input bg-background align-top accent-primary"
          />
          <span
            className={
              item.checked
                ? "flex-1 text-muted-foreground line-through decoration-muted-foreground decoration-[0.06em]"
                : "flex-1"
            }
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function MarkdownDesignSystem() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-6xl px-8 py-16">
        <section className="mb-20 max-w-3xl">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight">
            Complete Typography System
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            This comprehensive guide documents all supported markdown syntax elements and their
            corresponding visual representations. Every component is meticulously designed to
            maintain a consistent typographic rhythm and is displayed within its native
            <Code>#FCFBF6</Code>
            environment.
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <GuideIcon path="M4 6h16M4 12h16M4 18h7" />
              Base Size: 18px
            </span>
            <span className="flex items-center gap-2">
              <GuideIcon path="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              Scale: Major Third
            </span>
          </div>
        </section>

        <div className="space-y-24">
          <GuideSection title="Headings" iconPath="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12">
            <div className="space-y-8">
              <PreviewItem label="Heading 1 / Page Title" spec="h1.text-5xl.font-serif.font-bold">
                <PreviewCard className="p-10">
                  <H1 className="m-0">The Future of Digital Typography</H1>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Heading 2 / Major Section" spec="h2.text-3xl.border-b.pb-2">
                <PreviewCard className="p-10">
                  <H2 className="m-0">Principles of Good Design</H2>
                </PreviewCard>
              </PreviewItem>

              <div className="grid gap-8 md:grid-cols-2">
                <PreviewItem label="Heading 3 / Sub-section" spec="h3.text-2xl">
                  <PreviewCard className="flex h-[140px] items-center p-8">
                    <H3 className="m-0 w-full">Understanding Grid Systems</H3>
                  </PreviewCard>
                </PreviewItem>

                <PreviewItem label="Heading 4 / Minor Section" spec="h4.text-xl.font-medium">
                  <PreviewCard className="flex h-[140px] items-center p-8">
                    <H4 className="m-0 w-full">Baseline Alignment Techniques</H4>
                  </PreviewCard>
                </PreviewItem>

                <PreviewItem label="Heading 5 / Paragraph Group" spec="h5.text-lg.font-bold">
                  <PreviewCard className="flex h-[120px] items-center p-8">
                    <H5 className="m-0 w-full">Micro-typography Elements</H5>
                  </PreviewCard>
                </PreviewItem>

                <PreviewItem label="Heading 6 / Label" spec="h6.text-sm.uppercase.tracking-wider">
                  <PreviewCard className="flex h-[120px] items-center p-8">
                    <H6 className="m-0 w-full">Footnote References</H6>
                  </PreviewCard>
                </PreviewItem>
              </div>
            </div>
          </GuideSection>

          <GuideSection
            title="Inline Formatting"
            iconPath="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <PreviewItem label="Bold" spec="**text**">
                <PreviewCard className="p-6 text-center">
                  <Strong className="text-lg">Strong Emphasis</Strong>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Italic" spec="*text*">
                <PreviewCard className="p-6 text-center">
                  <Emphasis className="text-lg">Subtle Emphasis</Emphasis>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Strikethrough" spec="~~text~~">
                <PreviewCard className="p-6 text-center">
                  <Delete className="text-lg">Deleted Content</Delete>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Link" spec="[text](url)">
                <PreviewCard className="p-6 text-center">
                  <MdxLink href="#" className="font-serif text-lg">
                    Hyperlink Text
                  </MdxLink>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Highlight" spec="==text==">
                <PreviewCard className="p-6 text-center">
                  <Mark className="text-lg">Marked Text</Mark>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Keyboard Input" spec="&lt;kbd&gt;">
                <PreviewCard className="p-6 text-center">
                  <Keyboard>Ctrl + S</Keyboard>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Superscript" spec="^text^">
                <PreviewCard className="p-6 text-center font-serif text-lg">
                  E = mc<Superscript>2</Superscript>
                </PreviewCard>
              </PreviewItem>
              <PreviewItem label="Subscript" spec="~text~">
                <PreviewCard className="p-6 text-center font-serif text-lg">
                  H<Subscript>2</Subscript>O
                </PreviewCard>
              </PreviewItem>
            </div>
          </GuideSection>

          <GuideSection title="Block Elements" iconPath="M4 6h16M4 12h16M4 18h7">
            <div className="space-y-8">
              <PreviewItem label="Standard Paragraph" spec="p.text-lg.leading-relaxed">
                <PreviewCard className="p-10">
                  <Paragraph className="m-0">
                    Typography is the art and technique of arranging type to make written language
                    legible, readable, and appealing when displayed. The arrangement of type
                    involves selecting typefaces, point sizes, line lengths, line-spacing,
                    letter-spacing, and adjusting the space between pairs of letters.
                  </Paragraph>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Horizontal Rule" spec="hr.border-border">
                <PreviewCard className="px-10 py-12">
                  <p className="mb-6 text-center font-serif text-sm text-muted-foreground italic">
                    Content above separator
                  </p>
                  <HorizontalRule className="my-0" />
                  <p className="mt-6 text-center font-serif text-sm text-muted-foreground italic">
                    Content below separator
                  </p>
                </PreviewCard>
              </PreviewItem>

              <div className="grid gap-8 lg:grid-cols-2">
                <PreviewItem label="Blockquote" spec="&gt; blockquote">
                  <PreviewCard className="flex h-full flex-col justify-center p-10">
                    <Blockquote>
                      &quot;Good design is obvious. Great design is transparent.&quot;
                    </Blockquote>
                  </PreviewCard>
                </PreviewItem>

                <PreviewItem label="Blockquote with Attribution" spec="blockquote > cite">
                  <PreviewCard className="flex h-full flex-col justify-center p-10">
                    <blockquote className="m-0 border-y border-border py-4 text-center font-serif text-xl text-foreground">
                      <span className="italic">
                        &quot;Design is not just what it looks like and feels like. Design is how it
                        works.&quot;
                      </span>
                      <footer className="mt-4 font-sans text-sm font-medium tracking-wide text-muted-foreground">
                        — Steve Jobs
                      </footer>
                    </blockquote>
                  </PreviewCard>
                </PreviewItem>
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Lists" iconPath="M4 6h16M4 10h16M4 14h16M4 18h16">
            <div className="grid gap-8 lg:grid-cols-2">
              <PreviewItem label="Unordered List" spec="ul.list-disc">
                <PreviewCard className="h-full p-10">
                  <UnorderedList className="m-0">
                    <li>Establish visual hierarchy through scale.</li>
                    <li>Maintain consistent vertical rhythm.</li>
                    <li>Ensure sufficient color contrast.</li>
                    <li>Use whitespace purposefully to separate distinct concepts and elements.</li>
                  </UnorderedList>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Ordered List" spec="ol.list-decimal">
                <PreviewCard className="h-full p-10">
                  <OrderedList className="m-0">
                    <li>Define the core purpose of the interface.</li>
                    <li>Research user needs and expectations.</li>
                    <li>Sketch wireframes and user flows.</li>
                    <li>Develop high-fidelity prototypes for comprehensive user testing.</li>
                  </OrderedList>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Nested List" spec="ul > li > ul">
                <PreviewCard className="h-full p-10">
                  <UnorderedList className="m-0">
                    <li>
                      Front-end Development
                      <UnorderedList>
                        <li>HTML Structure</li>
                        <li>
                          CSS Styling
                          <UnorderedList>
                            <li>Flexbox Layouts</li>
                            <li>Grid Systems</li>
                          </UnorderedList>
                        </li>
                        <li>JavaScript Logic</li>
                      </UnorderedList>
                    </li>
                  </UnorderedList>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Task List" spec="- [x]">
                <PreviewCard className="h-full px-10 pt-14 pb-10">
                  <TaskListPreview />
                </PreviewCard>
              </PreviewItem>
            </div>
          </GuideSection>

          <GuideSection title="Code" iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4">
            <div className="space-y-8">
              <PreviewItem label="Inline Code" spec="`code`">
                <PreviewCard className="p-10">
                  <Paragraph className="m-0">
                    To install the dependencies, you should run
                    <Code>npm install</Code>
                    in your terminal before attempting to start the development server using
                    <Code>npm run dev</Code>.
                  </Paragraph>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Code Block (Syntax Highlighted)" spec="```javascript">
                <PreviewCard className="p-10">
                  <Pre data-filename="fetchData.js">
                    <code>
                      <span className="text-blue-600">async</span>{" "}
                      <span className="text-blue-600">function</span>{" "}
                      <span className="text-amber-800">fetchUserData</span>
                      (userId) {"{"}
                      {"\n  "}
                      <span className="text-blue-600">try</span> {"{"}
                      {"\n    "}
                      <span className="text-green-700">
                        {"// Fetch data from the remote API endpoint"}
                      </span>
                      {"\n    "}
                      <span className="text-blue-600">const</span> response ={" "}
                      <span className="text-blue-600">await</span>{" "}
                      <span className="text-amber-800">fetch</span>(
                      <span className="text-red-700">`https://api.example.com/users/</span>
                      <span className="text-blue-600">{"${"}</span>
                      userId
                      <span className="text-blue-600">{"}"}</span>
                      <span className="text-red-700">`</span>);
                      {"\n\n    "}
                      <span className="text-blue-600">if</span> (!response.ok) {"{"}
                      {"\n      "}
                      <span className="text-blue-600">throw</span>{" "}
                      <span className="text-blue-600">new</span>{" "}
                      <span className="text-amber-800">Error</span>(
                      <span className="text-red-700">"Network response was not ok"</span>
                      );
                      {"\n    }"}
                      {"\n\n    "}
                      <span className="text-blue-600">const</span> data ={" "}
                      <span className="text-blue-600">await</span> response.
                      <span className="text-amber-800">json</span>();
                      {"\n    "}
                      <span className="text-blue-600">return</span> data;
                      {"\n  } "}
                      <span className="text-blue-600">catch</span> (error) {"{"}
                      {"\n    "}console.
                      <span className="text-amber-800">error</span>(
                      <span className="text-red-700">"Error fetching user data:"</span>, error);
                      {"\n    "}
                      <span className="text-blue-600">return</span>{" "}
                      <span className="text-blue-600">null</span>;{"\n  }"}
                      {"\n}"}
                    </code>
                  </Pre>
                </PreviewCard>
              </PreviewItem>
            </div>
          </GuideSection>

          <GuideSection
            title="Data Display"
            iconPath="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          >
            <div className="space-y-8">
              <PreviewItem label="Table (Striped with Headers)" spec="| Header |">
                <PreviewCard className="overflow-hidden p-10">
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="w-1/4">Element</Table.Th>
                        <Table.Th className="w-1/2">Description</Table.Th>
                        <Table.Th className="w-1/4 text-right">Usage</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td className="font-medium text-foreground">Headings</Table.Td>
                        <Table.Td>Used to structure content hierarchically.</Table.Td>
                        <Table.Td className="text-right text-muted-foreground">Frequent</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td className="font-medium text-foreground">Blockquotes</Table.Td>
                        <Table.Td>Indicates text quoted from another source.</Table.Td>
                        <Table.Td className="text-right text-muted-foreground">Occasional</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td className="font-medium text-foreground">Tables</Table.Td>
                        <Table.Td>Organizes structured data into rows and columns.</Table.Td>
                        <Table.Td className="text-right text-muted-foreground">Rare</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td className="font-medium text-foreground">Lists</Table.Td>
                        <Table.Td>Groups related items sequentially or non-sequentially.</Table.Td>
                        <Table.Td className="text-right text-muted-foreground">Frequent</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Definition List" spec="Term : Definition">
                <PreviewCard className="p-10">
                  <DefinitionList>
                    <div>
                      <DefinitionTerm>Markdown</DefinitionTerm>
                      <DefinitionDescription>
                        A lightweight markup language with plain-text-formatting syntax. Its design
                        allows it to be converted to many output formats.
                      </DefinitionDescription>
                    </div>
                    <div>
                      <DefinitionTerm>Tailwind CSS</DefinitionTerm>
                      <DefinitionDescription>
                        A utility-first CSS framework packed with classes that can be composed to
                        build any design directly in markup.
                      </DefinitionDescription>
                    </div>
                  </DefinitionList>
                </PreviewCard>
              </PreviewItem>
            </div>
          </GuideSection>

          <GuideSection
            title="Media & References"
            iconPath="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <PreviewItem label="Image with Caption" spec='![Alt](url "Title")'>
                <PreviewCard className="flex h-full items-center justify-center p-10">
                  <Figure className="m-0 w-full max-w-sm">
                    <PlaceholderImage />
                    <Figcaption>Figure 1: Conceptual illustration of layout structure.</Figcaption>
                  </Figure>
                </PreviewCard>
              </PreviewItem>

              <PreviewItem label="Footnotes" spec="[^1]">
                <PreviewCard className="flex h-full flex-col justify-between p-10">
                  <div className="mb-8">
                    <Paragraph className="m-0">
                      The origins of modern typography can be traced back to Gutenberg&apos;s
                      invention of the movable type printing press in the 15th century
                      <Superscript>
                        <MdxLink href="#fn1">[1]</MdxLink>
                      </Superscript>
                      . This revolutionary technology democratized access to information and
                      standardized letterforms
                      <Superscript>
                        <MdxLink href="#fn2">[2]</MdxLink>
                      </Superscript>
                      .
                    </Paragraph>
                  </div>
                  <div className="border-t border-border pt-4">
                    <h4 className="mb-3 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      Footnotes
                    </h4>
                    <ol className="list-decimal space-y-2 pl-4 font-serif text-sm text-muted-foreground marker:font-sans marker:text-muted-foreground/70">
                      <li id="fn1" className="pl-2">
                        Johannes Gutenberg introduced mechanical movable type printing to Europe in
                        1439.
                        <MdxLink href="#" data-footnote-backref className="ml-1 text-xs">
                          ↩
                        </MdxLink>
                      </li>
                      <li id="fn2" className="pl-2">
                        The first typeface designs were based on handwriting styles of the era, such
                        as Textura.
                        <MdxLink href="#" data-footnote-backref className="ml-1 text-xs">
                          ↩
                        </MdxLink>
                      </li>
                    </ol>
                  </div>
                </PreviewCard>
              </PreviewItem>
            </div>
          </GuideSection>
        </div>

        <footer className="mt-24 border-t border-border pt-8 text-center">
          <p className="flex items-center justify-center gap-2 font-sans text-sm text-muted-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            End of Documentation
          </p>
        </footer>
      </main>
    </div>
  );
}
