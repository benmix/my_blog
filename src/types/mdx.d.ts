declare module "*.md" {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: Record<string, any>;
  export const toc: any;
}

declare module "*.mdx" {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: Record<string, any>;
  export const toc: any;
}
