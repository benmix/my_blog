import { PropsWithChildren } from "react";

export default function PostLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto prose prose-sm w-full max-w-[85ch] px-4 pt-8 max-md:prose-sm prose-a:no-underline hover:prose-a:underline">
      {children}
    </div>
  );
}
