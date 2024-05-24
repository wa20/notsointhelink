"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactTimeago from 'react-timeago'
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";


function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;

  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <Avatar>
          <AvatarImage src={post.user.userImage} />
          <AvatarFallback>
            {post.user.firstName?.charAt(0)}
            {post.user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex justify-between flex-1">
        <div>
          <p className="font-semibold">
            {post.user.firstName} {post.user.lastName}{" "}
            {isAuthor && (
              <Badge className="ml-2" variant="secondary">
                Author
              </Badge>
            )}
          </p>
          <p className="text-xs text-gray-400">
            @{post.user.firstName}
            {post.user.firstName}-{post.user.userId.toString().slice(-4)}
          </p>

          <p className="text-xs text-gray-400">
            <ReactTimeago date={new Date(post.createdAt)} />
          </p>
        </div>
        {isAuthor && (
          <Button>
            <Trash2 size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Post;