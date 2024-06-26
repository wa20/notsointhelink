'use client'

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { create } from "domain";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId); // bind the postId to the createCommentAction

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // copy the data inputted
    const formDataCopy = formData;

    // reset the form
    ref.current?.reset();

    try {
        //server action
        await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
        console.error(`An error occurred while commenting on the post: ${error}`)
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);

        toast.promise(promise, { 
          loading: "Creating comment...",
          success: "Comment created",
          error: "Error creating comment",
        })
      }}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 bg-white border rounded-full px-3 pr-1 py-1 ">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
        />
        <Button type="submit" hidden className="rounded-full">
          Comment
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
