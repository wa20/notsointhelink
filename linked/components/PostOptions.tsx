'use client'

import { IPostDocument } from '@/mongodb/models/post'
import { useUser } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { MessageCircle, Repeat, Send, ThumbsUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function PostOptions({ post }: { post: IPostDocument }) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(post.likes) //total number of likes
    const { user } = useUser()


    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true)
        }
    }, [post, user])


    return (
        <div>
            <div className='flex justify-between p-4'>
                <div>

                    {likes && likes.length > 0 && (
                        <p className='text-xs text-gray-500 cursor-pointer hover:underline'>
                            {likes.length} likes
                        </p>
                    )}
                </div>

                <div>
                    {post?.comments && post.comments.length > 0 && (
                        <p
                            className='text-xs text-gray-500 cursor-pointer hover:underline'
                            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        >
                            {post.comments.length} comments

                        </p>
                    )}
                </div>
            </div>

            <div>
                <Button
                    variant="ghost"
                    className='postButton'
                    // onClick={likeOrUnlikePost}
                >
                    <ThumbsUpIcon size={20} className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")} />
                    Like
                </Button>

                <Button
                    variant="ghost"
                    className='postButton'
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                >
                    <MessageCircle size={20} className={cn("mr-1", isCommentsOpen && "text-gray-600 fill-gray-600")} />
                    Comment
                </Button>

                {/* non functional buttons added for ui purposes */}

                <Button
                    variant="ghost"
                    className='postButton'
                >
                    <Repeat size={20} className="mr-1" />
                    Repost
                </Button>  

                <Button
                    variant="ghost"
                    className='postButton'
                >
                    <Send size={20} className="mr-1" />
                    Send
                </Button>  
            </div>


        </div>
    )
}

export default PostOptions