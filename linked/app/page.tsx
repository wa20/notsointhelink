import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInfo from "@/components/UserInfo";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";

export const revalidate = 0;

export default async function Home() {

  await connectDB();
  const posts = await Post.getAllPosts();

  console.log(posts);


  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInfo />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">

       <SignedIn>
        <PostForm />
       </SignedIn>
     
        <PostFeed posts={posts} />

      </section>

      <section className="hidden xl:inline justify-center col-span-2">
        {/* widget */}
      </section>
    </div>
  );
}
