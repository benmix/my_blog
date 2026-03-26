import { getPosts } from "@lib/get-post";
import { HomeGazette } from "@components/home-gazette";

export default async function IndexPage() {
  const articles = await getPosts();
  return <HomeGazette articles={articles} />;
}
