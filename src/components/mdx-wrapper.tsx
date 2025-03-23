import { MDXComponents } from "nextra/mdx-components";
import { Meta } from "./meta";
import { TocSider } from "./table-of-content";

export const Wrapper: Required<MDXComponents>["wrapper"] = ({
  children,
  toc,
  metadata,
}) => {
  return (
    <>
      <h1 className={"not-prose text-3xl mb-8"}>{metadata.title}</h1>
      <Meta metadata={metadata} />
      <TocSider toc={toc} />
      {children}
    </>
  );
};
