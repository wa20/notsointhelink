import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    { params }: { params: { post_id: string } }
) {
    await connectDB();

    try {
        const post = await Post.findById(params.post_id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: `An error occurred while fetching post ${error}` },
            { status: 500 }
        );
    }
}

// delete post request body
export interface DeletePostRequestBody {
    userId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: { post_id: string } }
) {
    auth().protect();

    // this checks the current user and bases the autherisation on that, it is a much safer way to authenticate the user
    // const user = await currentUser();

    await connectDB();

    // grabs user id out of the request body - this method is problematic as you can pass the id in the body of the request and not authenticate current user
    const { userId }: DeletePostRequestBody = await request.json();

    try {
        const post = await Post.findById(params.post_id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.user.userId !== userId) {
            return NextResponse.json(
                { error: "User is not post owner" },
                { status: 404 }
            );
        }

        await post.removePost();

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: `An error occurred while deleting post ${error}` },
            { status: 500 }
        );
    }
}
