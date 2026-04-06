import { format, toDate } from "date-fns";
import { getPageHref, getPageSlugSegments } from "@lib/post-path";
import type { BlogPage } from "@/types/blog";
import type { FC } from "react";
import { getTitleStyle } from "@lib/title-style";
import { Link } from "next-view-transitions";

type PostCardProps = {
  post: BlogPage;
};

export const PostLink: FC<PostCardProps> = ({ post }) => {
  const { date, chinese_name, english_name } = post.data;
  const slugs = getPageSlugSegments(post);
  const slug = slugs?.[slugs.length - 1];
  const displayTitle = chinese_name ?? english_name ?? slug ?? "";
  const titleStyle = typeof displayTitle === "string" ? getTitleStyle(displayTitle) : undefined;
  const formattedDate = date ? format(toDate(date), "MMM dd, y") : null;
  const href = getPageHref(post) ?? "#";

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
