import { Link } from "next-view-transitions";
import type { FC } from "react";
import { format } from "date-fns";
import { Item } from "nextra/normalize-pages";

type PostCardProps = {
  post: Item;
};

export const PostLink: FC<PostCardProps> = ({ post }) => {
  const { date, title } = post.frontMatter;
  return (
    <Link
      key={post.route}
      href={post.route}
      className="pt-6 pb-2 px-2 no-underline! text-gray-500"
    >
      <div className="flex justify-between">
        <span className="font-base grow-1  pr-4">{title}</span>
        <time className="text-sm text-gray-400 grow-0 basis-24 w-max flex-shrink-0 text-end">
          {format(date || "", "MMM d, y")}
        </time>
      </div>
    </Link>
  );
};
