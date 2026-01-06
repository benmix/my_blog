import type { ReactNode } from "react";
import { Meta } from "@components/meta";
import { TocSider } from "@components/table-of-content";
import type { BlogFrontmatter, TocItem } from "@/types";

type WrapperProps = {
  children?: ReactNode;
  toc?: TocItem[];
  metadata: BlogFrontmatter;
};

export const Wrapper = ({ children, toc, metadata }: WrapperProps) => {
  const heading = metadata.title ?? metadata.title_en ?? "";
  return (
    <>
      <h1 className={"not-prose mb-8 text-3xl"}>{heading}</h1>
      <Meta metadata={metadata} />
      <TocSider toc={toc} />
      {children}
    </>
  );
};
