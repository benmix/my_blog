import { PropsWithChildren } from "react";

export default function PostLayout({ children }: PropsWithChildren) {
  return <div className="w-full bg-background text-foreground">{children}</div>;
}
