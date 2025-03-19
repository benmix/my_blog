import { MDXComponents } from "nextra/mdx-components";
import { Meta } from "./meta";

export const Wrapper: Required<MDXComponents>["wrapper"] = ({
  children,
  metadata,
}) => {
  return (
    <>
      <h1 className={"not-prose text-3xl mb-8"}>{metadata.title}</h1>
      <Meta metadata={metadata} />
      {children}
    </>
  );
};
