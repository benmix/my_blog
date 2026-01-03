import { Link } from "next-view-transitions";
import type { FC } from "react";
import { format } from "date-fns";
import { Item } from "nextra/normalize-pages";

type PostCardProps = {
  post: Item;
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
  const { date, title } = post.frontMatter;
  const titleStyle = typeof title === "string" ? getTitleStyle(title) : undefined;
  return (
    <Link
      key={post.route}
      href={post.route}
      className="block pt-2 pb-4 font-light text-muted-foreground no-underline! hover:text-foreground max-md:text-xs"
    >
      <div className="flex justify-between">
        <span className="block grow pr-4 font-light" style={titleStyle}>
          {title}
        </span>
        <time className="w-max shrink-0 grow-0 basis-24 text-end text-sm text-muted-foreground max-md:hidden">
          {format(date || "", "MMM dd, y")}
        </time>
      </div>
    </Link>
  );
};
