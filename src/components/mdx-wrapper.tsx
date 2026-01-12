import { Meta } from "@components/meta";
import type { Post } from "content-collections";
import type { ReactNode } from "react";
import type { TocItem } from "@/types/blog";
import { TocSider } from "@components/table-of-content";

type WrapperProps = {
  children?: ReactNode;
  toc?: TocItem[];
  metadata: Post;
};

export const Wrapper = ({ children, toc, metadata }: WrapperProps) => {
  const heading = metadata.chinese_name ?? metadata.english_name ?? "";
  return (
    <>
      <h1 className={"not-prose mb-8 text-3xl"}>{heading}</h1>
      <Meta metadata={metadata} />
      <TocSider toc={toc} />
      {children}
    </>
  );
};
