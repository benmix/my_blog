import { Wrapper } from "@/components/mdx-wrapper";
import { importPage } from "nextra/pages";

export default async function Page(props: any) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
