# Newspaper + Poetry Markdown Component Library

## 概述

这是一套面向长文、随笔、评论、诗歌混排场景的 Markdown 组件库规范。目标不是把 Markdown 包装成 UI 系统，而是把排版本身变成语言的一部分：标题像社论，正文像版面，留白像停顿，旁注像低声补充。

设计基调：

- `Newspaper`：清晰层级、稳定栏宽、克制装饰、强调可读性。
- `Poetry`：窄栏、停顿、节奏、显式留白、允许句子呼吸。

这套系统遵守三个约束：

1. 保持 Markdown 语义可读，原始文本仍然像文章，不像模板语言。
2. 自定义语法必须在纯文本环境里优雅退化，不依赖 JSX。
3. 同一份内容应能映射到 Web、Terminal、MDX 三类渲染器。

当前仓库中的落地状态：

- 基础 MDX 组件映射定义在 `src/components/mdx-components.tsx`
- 文章页排版外壳定义在 `src/components/mdx-wrapper.tsx`
- `Newspaper + Poetry` 扩展组件当前拆分在 `src/components/mdx/`
- 组件回归展示页入口是 `src/app/markdown-design-system/page.tsx`
- 展示页实现位于 `src/components/markdown-design-system.tsx`
- 仓库规范禁止 `import *`、`export *` 和 barrel file

---

## 1. Component Taxonomy

### Editorial Meta

#### Kicker

用于标题上方的栏目名、主题标签、时间性标记。

- 语义：导语标签，不抢标题权重。
- 典型内容：`Essay`, `Notes from March`, `Field Dispatch`.

#### Headline

文章主标题。

- 语义：`h1`
- 风格：高对比、较紧字距、短行优先。

#### Subhead

标题后的副标题或摘要句。

- 语义：扩展导语，不替代首段。
- 风格：较轻、行长略短于正文。

### Reading Flow

#### Lead Paragraph

首段导语。承担“把读者带进文本”的作用。

- 语义：仍然是段落。
- 风格：更大字号、更松行高、更稳定节奏。

#### Drop Cap Paragraph

用于第一段首字放大。只应出现一次。

- 语义：段落变体，不是独立容器。
- 风格：首字下沉，正文保持安静。

#### Pull Quote

从正文中抽出的关键句。

- 语义：引文。
- 风格：独立成节，四周留白，视觉像版心中的呼吸点。

#### Aside / Marginal Note

补充说明、作者低声旁白、文中偏移视角。

- 语义：次级内容。
- 风格：更窄、更小、更淡，可贴右栏或内缩。

#### Annotation / Footnote

注释、出处、术语说明、补充事实。

- 语义：脚注或尾注。
- 风格：小号字、紧凑行高、与主文明确分层。

### Poetic Structure

#### Poetry Block

保留有意义换行的诗歌、片段、祈使句组。

- 语义：有意控制换行的文本块。
- 风格：窄栏、保留空行、不两端对齐。

#### Silence

显式留白。用于段落之间的沉默、时间切换、呼吸。

- 语义：空白间隔。
- 风格：它不是分隔线，而是未说出的句子。

#### Divider / Rule

章节切换、叙事转场、文气断点。

- 语义：`hr`
- 风格：细线、短线、居中记号都可，但必须克制。

### Media And Composition

#### Image With Caption

图片与说明文字。

- 语义：`figure > img + figcaption`
- 风格：说明像报纸图片注，短、准、靠近图片。

#### Multi-column Layout

用于并排放置两段 prose、诗与注、正文与旁注。

- 语义：布局容器，不改变内部语义。
- 风格：列与列之间以空气分隔，而不是卡片。

#### Prose Column

适合叙述性正文的宽栏。

- 行长：`60-72ch`
- 对齐：桌面端可两端对齐，移动端恢复左对齐。

#### Narrow / Poetic Column

适合诗歌、引语、祈祷文、短句列表。

- 行长：`24-36ch`
- 对齐：左对齐。

---

## 2. Markdown Syntax Design

说明：这一节描述的是推荐的作者语法。当前仓库已经完整实现了对应的 MDX 组件，但还没有把 fenced directive 语法正式接入 `remark` 编译链。

### 2.1 Design Goals

语法采用“fenced directive”风格：

- 原始 Markdown 中肉眼可读。
- 没有解析器时，也能被当作普通文本理解。
- 语义一眼可见。

基础形式：

```md
::component-name{key="value"}
Content
::
```

单行形式：

```md
::silence{size="l"}
```

### 2.2 Core Syntax

#### Kicker

```md
::kicker
Winter Journal
::
```

#### Headline

仍优先使用原生 Markdown：

```md
# The Last Morning of Winter
```

如需显式组件形式：

```md
::headline
The Last Morning of Winter
::
```

#### Subhead

```md
::subhead
An editorial meditation on cold light, late trains, and the discipline of waiting.
::
```

#### Lead

```md
::lead
By the time the sun reached the newspaper stand, the city had already chosen its mood.
::
```

#### Pull Quote

```md
::pull-quote{attribution="Notebook, 6:10 AM"}
What we call weather is sometimes only memory finding a public form.
::
```

#### Poetry

```md
::poetry
I walked alone  
through a quiet street  
where shadows spoke first
::
```

#### Aside

```md
::aside{tone="margin"}
This paragraph is meant to be read slowly.
::
```

#### Annotation

```md
::annotation{label="Note"}
The station clock was repaired in 1931 and still runs four minutes slow.
::
```

#### Divider

```md
::divider{glyph="section"}
```

#### Silence

```md
::silence{size="xl"}
```

#### Image + Caption

```md
::figure{src="/images/winter-street.jpg" alt="A narrow street at dawn" caption="South alley before the buses arrived."}
::
```

#### Columns

```md
::columns{layout="prose-poetry"}

:::column{span="prose"}
The city reports itself in surfaces first: headlines, windows, wet pavement.
:::

:::column{span="poetry"}
Rain on iron  
light in glass  
one shoeprint left
:::

::
```

### 2.3 Graceful Degradation Rules

没有自定义解析器时：

- `::lead` 等 fenced block 仍然保留可读标签。
- 内容本体不会丢失。
- `figure` 至少应退化为一个带属性说明的块。
- `columns` 退化为线性文档顺序。

Terminal 渲染建议：

- `kicker`：转为全大写小标题。
- `pull-quote`：转为前缀 `>`.
- `aside`：缩进 2 到 4 个空格。
- `silence`：转为 1 到 3 个空行。
- `divider`：转为 `* * *` 或 `---`.

---

## 3. Rendering Spec

### 3.1 Shared Wrapper

建议所有组件在一个统一排版上下文中工作：

```html
<article class="np-article" data-layout="prose">...</article>
```

```css
.np-article {
  --np-body-max: 68ch;
  --np-poetry-max: 32ch;
  --np-measure-tight: 22ch;
  --np-gap-1: 0.5rem;
  --np-gap-2: 0.75rem;
  --np-gap-3: 1rem;
  --np-gap-4: 1.5rem;
  --np-gap-5: 2rem;
  --np-gap-6: 3rem;
  color: var(--np-ink, var(--foreground));
}
```

### 3.2 Component Mapping

#### Kicker

```html
<p class="np-kicker">Winter Journal</p>
```

```css
.np-kicker {
  margin: 0 0 var(--np-gap-2);
  font: 600 0.75rem/1.2 var(--np-sans);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--np-muted);
}
```

#### Headline

```html
<h1 class="np-headline">The Last Morning of Winter</h1>
```

```css
.np-headline {
  max-width: 16ch;
  margin: 0 0 var(--np-gap-3);
  font-family: var(--np-serif);
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  line-height: 0.96;
  letter-spacing: -0.03em;
  text-wrap: balance;
}
```

#### Subhead

```html
<p class="np-subhead">...</p>
```

```css
.np-subhead {
  max-width: 42ch;
  margin: 0 0 var(--np-gap-5);
  font: 400 1.125rem/1.55 var(--np-sans);
  color: var(--np-dim);
}
```

#### Lead Paragraph

```html
<p class="np-lead">...</p>
```

```css
.np-lead {
  max-width: var(--np-body-max);
  margin: 0 0 var(--np-gap-4);
  font: 400 1.25rem/1.7 var(--np-sans);
  text-wrap: pretty;
}
```

#### Drop Cap Paragraph

```html
<p class="np-dropcap">...</p>
```

```css
.np-dropcap::first-letter {
  float: left;
  margin: 0.08em 0.12em 0 0;
  font-family: var(--np-serif);
  font-size: 4.4em;
  line-height: 0.82;
}
```

#### Pull Quote

```html
<figure class="np-pull-quote">
  <blockquote>
    <p>What we call weather is sometimes only memory finding a public form.</p>
  </blockquote>
  <figcaption>Notebook, 6:10 AM</figcaption>
</figure>
```

```css
.np-pull-quote {
  max-width: 28ch;
  margin: var(--np-gap-6) auto;
  padding-block: var(--np-gap-4);
  border-block: 1px solid var(--np-rule);
}

.np-pull-quote blockquote {
  margin: 0;
  font-family: var(--np-serif);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  line-height: 1.28;
  font-style: italic;
}

.np-pull-quote figcaption {
  margin-top: var(--np-gap-2);
  font: 500 0.8rem/1.4 var(--np-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--np-muted);
}
```

#### Poetry Block

```html
<div class="np-poetry" data-align="left">
  <p>I walked alone<br />through a quiet street<br />where shadows spoke first</p>
</div>
```

```css
.np-poetry {
  max-width: var(--np-poetry-max);
  margin: var(--np-gap-5) 0;
}

.np-poetry p {
  margin: 0;
  white-space: pre-wrap;
  font: 400 1.05rem/1.9 var(--np-serif);
}
```

#### Aside

```html
<aside class="np-aside" data-tone="margin">
  <p>This paragraph is meant to be read slowly.</p>
</aside>
```

```css
.np-aside {
  max-width: 30ch;
  margin: var(--np-gap-4) 0 var(--np-gap-4) auto;
  padding-left: var(--np-gap-3);
  border-left: 1px solid var(--np-rule);
  font: 400 0.95rem/1.7 var(--np-sans);
  color: var(--np-dim);
}
```

#### Annotation / Footnote

```html
<div class="np-annotation">
  <span class="np-annotation-label">Note</span>
  <p>...</p>
</div>
```

```css
.np-annotation {
  max-width: 52ch;
  margin-top: var(--np-gap-3);
  font: 400 0.875rem/1.6 var(--np-sans);
  color: var(--np-muted);
}
```

#### Divider

```html
<hr class="np-divider" data-glyph="section" />
```

```css
.np-divider {
  width: 5rem;
  margin: var(--np-gap-6) auto;
  border: 0;
  border-top: 1px solid var(--np-rule);
}
```

可选字形变体：

- `line`: 单细线
- `section`: `§`
- `asterism`: `* * *`

#### Image With Caption

```html
<figure class="np-figure">
  <img src="/images/winter-street.jpg" alt="A narrow street at dawn" />
  <figcaption>South alley before the buses arrived.</figcaption>
</figure>
```

```css
.np-figure {
  margin: var(--np-gap-5) 0;
}

.np-figure img {
  display: block;
  width: 100%;
  height: auto;
}

.np-figure figcaption {
  max-width: 56ch;
  margin-top: var(--np-gap-2);
  font: 400 0.85rem/1.55 var(--np-sans);
  color: var(--np-muted);
}
```

#### Multi-column Layout

```html
<section class="np-columns" data-layout="prose-poetry">
  <div class="np-column" data-span="prose">...</div>
  <div class="np-column" data-span="poetry">...</div>
</section>
```

```css
.np-columns {
  display: grid;
  gap: clamp(1.5rem, 4vw, 4rem);
  margin: var(--np-gap-5) 0;
}

.np-columns[data-layout="equal"] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.np-columns[data-layout="prose-poetry"] {
  grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.9fr);
}

@media (max-width: 900px) {
  .np-columns,
  .np-columns[data-layout="equal"],
  .np-columns[data-layout="prose-poetry"] {
    grid-template-columns: 1fr;
  }
}
```

### 3.3 Tailwind / CSS Variable Mapping

推荐变量：

```css
:root {
  --np-paper: var(--background);
  --np-ink: var(--foreground);
  --np-rule: var(--border);
  --np-dim: var(--muted-foreground);
  --np-muted: color-mix(in oklab, var(--foreground) 62%, transparent);
  --np-serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --np-sans: ui-sans-serif, "Avenir Next", "Segoe UI", sans-serif;
  --np-mono: "SFMono-Regular", "JetBrains Mono", ui-monospace, monospace;
}
```

Tailwind 对应思路：

- `headline`: `font-serif tracking-tight`
- `lead`: `font-sans text-xl leading-8`
- `poetry`: `max-w-[32ch] whitespace-pre-wrap`
- `aside`: `ml-auto max-w-[30ch] border-l pl-4 text-sm`
- `pull-quote`: `mx-auto max-w-[28ch] border-y py-6 text-center`

---

## 4. Typography System

### 4.1 Font Pairing

推荐搭配分两档：

#### Zero-dependency Stack

- Display / Headline: `Iowan Old Style`, `Palatino Linotype`, `Book Antiqua`, `Georgia`, `serif`
- Body / UI: `ui-sans-serif`, `Avenir Next`, `Segoe UI`, `sans-serif`
- Notes / metadata: `ui-monospace`, `SFMono-Regular`, `JetBrains Mono`, `monospace`

#### Premium Editorial Stack

- Headline: `Canela`, `Noe Display`, `Tiempos Headline`
- Body: `Financier Text`, `Source Sans 3`, `Newsreader Sans equivalent`
- Mono: `IBM Plex Mono`, `Berkeley Mono`

### 4.2 Type Scale

采用“报纸标题 + 书籍正文”的混合比例，不追求机械式 modular scale。

| Token     | Size                         | Line Height  | Use        |
| --------- | ---------------------------- | ------------ | ---------- |
| `display` | `clamp(3rem, 7vw, 5.5rem)`   | `0.94`       | 封面级标题 |
| `h1`      | `clamp(2.4rem, 6vw, 4.8rem)` | `0.96`       | 文章主标题 |
| `h2`      | `clamp(1.8rem, 4vw, 2.8rem)` | `1.05`       | 大章节     |
| `h3`      | `1.5rem`                     | `1.15`       | 中章节     |
| `h4`      | `1.25rem`                    | `1.25`       | 小章节     |
| `lead`    | `1.25rem`                    | `1.7`        | 导语       |
| `body`    | `1rem - 1.0625rem`           | `1.75 - 1.9` | 正文       |
| `aside`   | `0.95rem`                    | `1.7`        | 旁注       |
| `caption` | `0.85rem`                    | `1.55`       | 图注       |
| `note`    | `0.8rem`                     | `1.5`        | 注释       |

### 4.3 Line Height System

- Headline: `0.94 - 1.05`
- Section heads: `1.05 - 1.2`
- Body prose: `1.72 - 1.9`
- Poetry: `1.8 - 2.0`
- Captions / notes: `1.45 - 1.6`

原则：

- 标题紧，正文松。
- 诗歌比散文更需要垂直呼吸。
- 元信息应紧凑，但不能挤压。

### 4.4 Vertical Rhythm Grid

使用 `4px` 微栅格，组件间距落在 `8 / 12 / 16 / 24 / 32 / 48px` 上。

推荐节奏：

- 标题后：`24px`
- 副标题后：`32px`
- 正文段落间：`20-24px`
- 引言与诗歌块前后：`32-48px`
- 大章节切换：`48-64px`

---

## 5. Layout System

### 5.1 Column Modes

#### Single / Prose

- 用途：主文章流
- 最大宽度：`68ch`
- 桌面端：可两端对齐
- 移动端：左对齐

#### Dual / Editorial

- 用途：正文 + 旁注，或正文 + 图注组
- 比例：`1.6fr / 1fr` 或 `3fr / 2fr`
- 小屏：自动折叠为单列

#### Poetic Narrow

- 用途：诗、短句、引语、祈祷文
- 最大宽度：`24-36ch`
- 位置：左对齐或居中，避免过宽

### 5.2 Responsive Behavior

- `< 640px`：一律单列，保留层级，不强制报纸式双栏。
- `640px - 900px`：主文单列，允许窄栏组件居中。
- `> 900px`：启用 editorial 双栏、旁注右浮、拉引语居中。

### 5.3 Margins And Padding Philosophy

原则不是“包住内容”，而是“让内容有空气”。

- 优先用 `margin-block` 建节奏。
- 只有旁注、注释类组件使用轻量边线或内边距。
- 不用厚重背景块模拟层级。
- 图片和引语由留白和规则线建立边界，而不是阴影。

---

## 6. Example Document

```md
::kicker
Winter Journal
::

# The Last Morning of Winter

::subhead
An editorial meditation on cold light, late trains, and the discipline of waiting.
::

::lead
By the time the sun reached the newspaper stand, the city had already chosen its mood.
::

The first vendor unfolded the papers with the solemnity of a priest preparing a table.
Nothing dramatic happened. A bus sighed. Someone dropped coins. A dog refused the rain.
Still, the street carried the tension of a page before the first sentence lands.

::aside{tone="margin"}
Read this next section as if you were listening from the doorway, not from the center of the room.
::

::pull-quote{attribution="Notebook, 6:10 AM"}
What we call weather is sometimes only memory finding a public form.
::

## The Public Weather

::columns{layout="prose-poetry"}

:::column{span="prose"}
Newspapers teach the eye to move with discipline. Headline, deck, image, caption, then the slow river
of paragraphs. Poetry teaches the opposite discipline: not to rush the line break, not to confuse
silence with absence, not to read over a pause because prose would have let you.
:::

:::column{span="poetry"}
Rain on iron  
light in glass  
one shoeprint left  
to argue with noon
:::

::

::figure{src="/images/winter-street.jpg" alt="A narrow street at dawn" caption="South alley before the buses arrived."}
::

::annotation{label="Note"}
The station clock was repaired in 1931 and still runs four minutes slow. The local papers mention this
often enough that the inaccuracy has become a kind of civic truth.
::

::divider{glyph="asterism"}

## The Private Weather

::poetry
I walked alone  
through a quiet street  
where shadows spoke first

Not loudly.  
Only enough  
to change the pace of my hands.
::

::silence{size="l"}

The article ended where the day began: with a table, a folded sheet, and the small labor of
finding a sentence that could stand in public without losing its hush.
```

---

## 7. Implementation

### 7.1 MDX-Compatible Component API

当前仓库已经实现两层组件。

第一层是基础 MDX 语义组件：

```tsx
<H1 />
<H2 />
<H3 />
<H4 />
<H5 />
<H6 />
<Paragraph />
<Blockquote />
<Figure />
<Figcaption />
<Image />
<OrderedList />
<UnorderedList />
<ListItem />
<Table />
<HorizontalRule />
<FootnoteSection />
<MdxLink />
<Strong />
<Emphasis />
<Delete />
<Mark />
<Code />
<Keyboard />
<Superscript />
<Subscript />
```

第二层是 `Newspaper + Poetry` 扩展组件：

```tsx
<Kicker>Winter Journal</Kicker>
<Subhead>...</Subhead>
<Lead>...</Lead>
<PullQuote attribution="Notebook, 6:10 AM">...</PullQuote>
<Poetry>...</Poetry>
<PoetryBody>...</PoetryBody>
<Aside tone="margin">...</Aside>
<Annotation label="Note">...</Annotation>
<Divider glyph="asterism" />
<Silence size="l" />
<FigureWithCaption src="/images/winter-street.jpg" alt="..." caption="..." />
<Columns layout="prose-poetry">
  <Column span="prose">...</Column>
  <Column span="poetry">...</Column>
</Columns>
```

这些组件当前直接注册在 `src/components/mdx-components.tsx`，由 `MDXContent` 渲染。

### 7.2 Current File Map

当前 `Newspaper + Poetry` 目录结构：

```text
src/components/mdx/
  annotation.tsx
  aside.tsx
  column.tsx
  columns.tsx
  divider.tsx
  drop-cap.tsx
  figure-with-caption.tsx
  kicker.tsx
  lead.tsx
  poetry-body.tsx
  poetry.tsx
  pull-quote.tsx
  silence.tsx
  subhead.tsx
```

拆分规则：

- 每个组件一个文件
- 不使用 `barrel file`
- 不使用 `export *` 或 `export * as`
- 不使用 `import *` 或 `import * as`

### 7.3 Preferred Parser Design

更符合这套系统精神的方案是 remark 插件，把 fenced directives 转成语义节点。

处理流程：

1. `remark-parse`
2. `remark-gfm`
3. `remark-math`
4. `remarkNewspaperPoetryDirectives`
5. `rehype` 阶段输出语义 HTML

#### Parser Rules

- `::lead ... ::` -> `<p class="np-lead">`
- `::poetry ... ::` -> `<div class="np-poetry"><p>...</p></div>`
- `::aside ... ::` -> `<aside class="np-aside">`
- `::pull-quote{attribution=""} ... ::` -> `<figure class="np-pull-quote">`
- `::columns` / `:::column` -> grid 容器和列节点
- `::silence{size="m"}` -> `<div aria-hidden="true" class="np-silence">`

#### AST Strategy

推荐将其转为带 `data-*` 属性的通用节点，避免过早耦合具体样式：

```ts
type NewspaperPoetryNode = {
  type: "containerDirective" | "leafDirective";
  name:
    | "kicker"
    | "headline"
    | "subhead"
    | "lead"
    | "pull-quote"
    | "poetry"
    | "aside"
    | "annotation"
    | "divider"
    | "silence"
    | "columns"
    | "column"
    | "figure";
  attributes?: Record<string, string>;
  children?: Node[];
};
```

#### Web / Terminal / MDX Mapping

| Component | Web                   | Terminal                        | MDX           |
| --------- | --------------------- | ------------------------------- | ------------- |
| `kicker`  | styled `<p>`          | uppercase label                 | `<Kicker />` |
| `lead`    | large intro `<p>`     | plain paragraph with blank line | `<Lead />` |
| `poetry`  | narrow pre-wrap block | preserved line breaks           | `<Poetry />` + `<PoetryBody />` |
| `aside`   | right-shifted aside   | indented note                   | `<Aside />` |
| `silence` | vertical spacer       | blank lines                     | `<Silence />` |
| `columns` | grid                  | linearized order                | `<Columns />` + `<Column />` |

### 7.4 Current Gaps

当前还没有正式实现的部分：

- fenced directive 到 AST 的解析插件
- directive attributes 到组件 props 的编译规则
- terminal 端映射层

当前已经实现并可以直接验证的部分：

- Web / MDX 组件渲染
- 文章页 wrapper 和新版版式节奏
- `markdown-design-system` 展示页回归

### 7.5 Authoring Rules

- `Headline` 优先仍用原生 `#`.
- 只有当“布局本身承载意义”时才用 `columns`.
- `silence` 不应高频使用，每次都应有叙事理由。
- `pull-quote` 每篇不超过 `2-3` 个。
- `poetry` 内的换行必须是作者有意决定的换行，不是被容器挤出来的换行。

---

## 8. Design Summary

这套系统不把 Markdown 当成内容载体的最低形态，而把它当成一份可排版的手稿。

它的核心不是“更多组件”，而是三件事：

1. 让标题、正文、旁注、诗行拥有清楚且克制的秩序。
2. 让留白、停顿、窄栏这些通常被 CSS 隐藏的决定，进入作者语言。
3. 让同一份文本在 Web、Terminal、MDX 中都保留文体，而不只保留字面内容。
