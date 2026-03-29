import { cn } from "@lib/utils";

type CodeProps = import("react").ComponentProps<"code"> & {
  "data-language"?: string;
};

function isInlineCode(children: CodeProps["children"]) {
  if (typeof children === "string" || typeof children === "number") {
    return true;
  }

  if (
    Array.isArray(children) &&
    children.every((item) => typeof item === "string" || typeof item === "number")
  ) {
    return true;
  }

  return false;
}

export function Code({ children, className, ...props }: CodeProps) {
  const isBlockCode =
    Boolean(className?.includes("language-")) ||
    typeof props["data-language"] === "string" ||
    !isInlineCode(children);

  return (
    <code
      className={cn(
        isBlockCode
          ? "code-block block bg-transparent p-0 font-mono text-[0.92rem] leading-[1.75]"
          : "rounded-[4px] border border-code-border bg-code-bg px-1.5 py-0.5 font-mono text-sm text-code-text",
        className,
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  );
}
