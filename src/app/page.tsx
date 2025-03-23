import { Link } from "@components/link";
import { PostLink } from "@components/post-link";
import { getPosts } from "@lib/get-post";
import { Image } from "@components/image";

export default async function IndexPage() {
  const articles = await getPosts();
  return (
    <article>
      <Image
        src="/home-background.webp"
        dir="ltr"
        alt="月亮湾，文昌，海南"
        aria-description="月亮湾，文昌，海南"
        className="object-center object-cover h-[280] w-full rounded-sm max-md:h-[200]"
      />
      <blockquote className="indent-4 text-lg max-md:text-sm text-gray-600">
        你好，欢迎到访，请随意浏览，愿有所得。
      </blockquote>
      <div className="mt-16 max-md:mt-12">
        <h2 className="text-slate-500 max-md:text-sm"> 文章 </h2>
        <div>
          {articles.map((post) => {
            return <PostLink key={post.route} post={post} />;
          })}
        </div>
        <h2 className="text-slate-500 max-md:text-sm">最近阅读的书</h2>
        <Link
          className="text-gray-400 max-md:text-xs hover:text-gray-500 font-light"
          target="_blank"
          href="https://benmix.notion.site/a40e2bf289d244edbcf2acf0b6acdfc2?v=61358fa5f66942bd8aeaeb714c3d808d"
        >
          点击查看
        </Link>
      </div>
    </article>
  );
}
