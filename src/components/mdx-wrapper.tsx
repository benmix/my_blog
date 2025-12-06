import { MDXComponents } from "nextra/mdx-components";
import { Meta } from "@components/meta";
import { TocSider } from "@components/table-of-content";

export const Wrapper: Required<MDXComponents>["wrapper"] = ({ children, toc, metadata }) => {
  return (
    <>
      <h1 className={"not-prose mb-8 text-3xl"}>{metadata.title}</h1>
      <Meta metadata={metadata} />
      <TocSider toc={toc} />
      {children}
    </>
  );
};
