import { getPosts } from "@lib/get-post";
import { Home } from "@/components/home";

export default async function IndexPage() {
  const articles = await getPosts();
  return <Home articles={articles} />;
}
