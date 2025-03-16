import { Link } from "@components/link";
import { PostLink } from "@components/post-link";
import { getPosts } from "@lib/get-post";
import { Image } from "nextra/components";

export default async function IndexPage() {
  const articles = await getPosts();
  return (
    <article>
      <Image
        src="/home-background.webp"
        dir="ltr"
        alt="月亮湾，文昌，海南"
        aria-description="月亮湾，文昌，海南"
        className="object-center object-cover h-[280] w-full rounded-sm"
      />
      {/* <p className="indent-8">你好，下面是我写的文章，我想把他们分享给你。</p> */}
      <div>
        <h2 className="text-gray-600"> 文章 </h2>
        <p>
          {articles.map((post) => {
            return <PostLink post={post} />;
          })}
        </p>
        <h2 className="text-gray-600">最近阅读的书</h2>
        <Link
          className="text-gray-400"
          target="_blank"
          href="https://benmix.notion.site/a40e2bf289d244edbcf2acf0b6acdfc2?v=61358fa5f66942bd8aeaeb714c3d808d"
        >
          点击查看
        </Link>
      </div>
    </article>
  );
}
