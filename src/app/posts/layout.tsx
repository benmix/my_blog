import { PropsWithChildren } from "react";

export default function PostLayout({ children }: PropsWithChildren) {
  return <div className="pt-8"> {children} </div>;
}
