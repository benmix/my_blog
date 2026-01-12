import { getPosts } from "@lib/get-post";
import { Image } from "@components/image";
import { PostLink } from "@components/post-link";

export default async function IndexPage() {
  const articles = await getPosts();
  return (
    <article className="md:mt-24">
      <Image
        src="/home-background.webp"
        livePhotoSrc="/home-background.mp4"
        livePhotoType="video/mp4"
        livePhotoAutoPlay
        livePhotoLoop
        livePhotoMuted
        livePhotoControls={false}
        dir="ltr"
        alt="月亮湾，文昌，海南"
        aria-description="月亮湾，文昌，海南"
        className="not-prose my-7 h-[280] w-full rounded-sm object-cover object-center max-md:h-[200]"
      />
      <div className="mt-16 max-md:mt-12">
        <h2 className="text-muted-foreground max-md:text-sm"> 文章 </h2>
        <div>
          {articles.map((post) => {
            const key =
              post.url ??
              post.slugs?.join("/") ??
              post.data.chinese_name ??
              post.data.english_name ??
              "post";
            return <PostLink key={key} post={post} />;
          })}
        </div>
      </div>
    </article>
  );
}
