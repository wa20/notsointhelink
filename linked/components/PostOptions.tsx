"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import { set } from "mongoose";
import CommentFeed from "./CommentFeed";
import CommentForm from "./commentForm";

function PostOptions({
    post,
    postId,
}: {
    post: IPostDocument, postId: string
}) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes); //total number of likes
    const { user } = useUser();

    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true);
        }
    }, [post, user]);

    const likeOrUnlikePost = async () => {
        if (!user?.id) {
            throw new Error("User not authenticated");
        }

        const originalLikes = likes;
        const originalLiked = liked;

        const newLikes = liked
            ? likes?.filter((like) => user.id)
            : [...(likes ?? []), user.id];

        const body: LikePostRequestBody | UnlikePostRequestBody = {
            userId: user.id,
        };

        setLiked(!liked);
        setLikes(newLikes);

        const res = await fetch(
            `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        if (!res.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);

            throw new Error("An error occurred while liking or unliking the post");
        }

        const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
        if (!fetchLikesResponse.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("An error occurred while fetching likes");
        }

        const newLikesData = await fetchLikesResponse.json();

        setLikes(newLikesData);
    };

    return (
        <div>
            <div className="flex justify-between p-4">
                <div>
                    {likes && likes.length > 0 && (
                        <p className="text-xs text-gray-500 cursor-pointer hover:underline">
                            {likes.length} likes
                        </p>
                    )}
                </div>

                <div>
                    {post?.comments && post.comments.length > 0 && (
                        <p
                            className="text-xs text-gray-500 cursor-pointer hover:underline"
                            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        >
                            {post.comments.length} comments
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end px-2 border-t">
                <Button
                    variant="ghost"
                    className="postButton"
                    onClick={likeOrUnlikePost}
                >
                    <ThumbsUpIcon
                        size={20}
                        className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
                    />
                    Like
                </Button>

                <Button
                    variant="ghost"
                    className="postButton"
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                >
                    <MessageCircle
                        size={20}
                        className={cn(
                            "mr-1",
                            isCommentsOpen && "text-gray-600 fill-gray-600"
                        )}
                    />
                    Comment
                </Button>

                {/* non functional buttons added for ui purposes */}

                <Button variant="ghost" className="postButton">
                    <Repeat size={20} className="mr-1" />
                    Repost
                </Button>

                <Button variant="ghost" className="postButton">
                    <Send size={20} className="mr-1" />
                    Send
                </Button>
            </div>

            {isCommentsOpen && (
                <div className="p-4">
                    {/* two methods to authenticate if user is signed in, one is below */}
                    {/* {user?.id && <CommentForm postId={postId} />} */}

                    {/* second method is using clerks SignedIn component */}

                    <SignedIn>
                        <CommentForm postId={postId} />
                    </SignedIn>

                    <CommentFeed post={post} />
                </div>
            )}
        </div>
    );
}

export default PostOptions;
