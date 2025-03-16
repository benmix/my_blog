import { Callout, withGitHubAlert } from "nextra/components";

export const Blockquote = withGitHubAlert(({ type, ...props }) => {
  const calloutType = (
    {
      caution: "error",
      important: "error", // TODO
      note: "info",
      tip: "default",
      warning: "warning",
    } as const
  )[type];

  return <Callout type={calloutType} {...props} />;
});
