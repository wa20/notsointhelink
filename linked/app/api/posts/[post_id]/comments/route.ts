import connectDB from "@/mongodb/db";
import { auth } from "@clerk/nextjs/server";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {

    await connectDB();

    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}


export interface AddCommentRequestBody {
    user: IUser;
    text: string;
  }


  export async function POST(
    request: Request,
    { params }: { params: { post_id: string } }
  ) {

    auth().protect();
    await connectDB();
  
    const { user, text }: AddCommentRequestBody = await request.json();
  
    try {
        const post = await Post.findById(params.post_id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment: ICommentBase = { 
            user,
            text,
        }

        await post.commentOnPost(comment);
        
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while commenting on the post" },
            { status: 500 }
        );
        
    }


  }                 