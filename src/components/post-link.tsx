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
      className="block pt-2 pb-4 font-light text-gray-400 no-underline! hover:text-gray-500 max-md:text-xs"
    >
      <div className="flex justify-between">
        <span className="font-base grow-1 pr-4 underline">{title}</span>
        <time className="w-max flex-shrink-0 grow-0 basis-24 text-end text-sm text-gray-400 no-underline! max-md:hidden">
          {format(date || "", "MMM d, y")}
        </time>
      </div>
    </Link>
  );
};
