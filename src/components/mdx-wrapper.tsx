import type { TocItem } from "@/types/blog";
import { Meta } from "@components/meta";
import { TocSider } from "@components/table-of-content";
import type { Post } from "content-collections";
import type { ReactNode } from "react";

type WrapperProps = {
  children?: ReactNode;
  toc?: TocItem[];
  metadata: Post;
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
