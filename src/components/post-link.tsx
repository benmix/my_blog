import { Link } from "next-view-transitions";
import type { FC } from "react";
import { format, toDate } from "date-fns";
import type { BlogPage } from "@/types/blog";

type PostCardProps = {
  post: BlogPage;
};

const HANGING_PUNCTUATION_RE =
  /^[\u3001\u3002\uFF0C\uFF1B\uFF1A\uFF01\uFF1F\u201C\u201D\u2018\u2019\u300C\u300D\u300E\u300F\u3008\u3009\u300A\u300B\u3010\u3011\u3014\u3015\u3016\u3017\u3018\u3019\uFF08\uFF09\uFF3B\uFF3D\uFF5B\uFF5D]/;

const getTitleStyle = (title: string) =>
  HANGING_PUNCTUATION_RE.test(title)
    ? {
        display: "inline-block",
        textIndent: "-0.5em",
      }
    : undefined;

export const PostLink: FC<PostCardProps> = ({ post }) => {
  const { date, title, title_en } = post.data;
  const slug = post.slugs?.[post.slugs.length - 1];
  const displayTitle = title ?? title_en ?? slug ?? "";
  const titleStyle = typeof displayTitle === "string" ? getTitleStyle(displayTitle) : undefined;
  const formattedDate = date ? format(toDate(date), "MMM dd, y") : null;
  const href = post.url ?? (slug ? `/posts/${slug}` : "#");

  return (
    <Link
      key={href}
      href={href}
      className="block pt-2 pb-4 font-light text-muted-foreground no-underline! hover:text-foreground max-md:text-xs"
    >
      <div className="flex justify-between">
        <span className="block grow pr-4 font-light" style={titleStyle}>
          {displayTitle}
        </span>
        <time className="w-max shrink-0 grow-0 basis-24 text-end text-sm text-muted-foreground max-md:hidden">
          {formattedDate}
        </time>
      </div>
    </Link>
  );
};
