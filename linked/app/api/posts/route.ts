import connectDB from "@/mongodb/db";
import { IUser } from "@/types/user";
import { IPostBase, Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

//type interface

export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}

export async function POST(request: Request) {
  auth().protect(); //this protects the route using clerk authentication
  const { user, text, imageUrl }: AddPostRequestBody = await request.json();

  try {
    await connectDB();

    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }),
    };

    const post = await Post.create(postData);
    return NextResponse.json({message: "Post created successfully", post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
        { error: `An error occurred while creating the post, ${error}` },
        { status: 500 }
      );
  }
} 

export async function GET(request: Request) {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while fetching posts ${error}` },
      { status: 500 }
    );
  }
}
