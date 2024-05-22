'use client'

import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useUser } from '@clerk/nextjs'
import { Button } from './ui/button';
import { ImageIcon, XIcon } from 'lucide-react';

function PostForm() {
    const [preview, setPreview] = useState<string | null>(null)
    const ref = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useUser();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    console.log('client user: ', user)


    return (
        <div>
            <form ref={ref} action="">
                <div className='flex items-center space-x-2'>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <input
                        type='text'
                        name="postInput"
                        placeholder='Start writing a post...'
                        className='flex-1 outline-none rounded-full py-3 px-4 border'
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />

                    <button type='submit' hidden>
                        Post
                    </button>
                </div>

                {preview && (
                    <div className="mt-2">
                        <img src={preview} alt="Preview" className="w-full object-cover" />
                    </div>
                )}

                <div className='flex justify-end mt-2 space-x-2'>
                    <Button type="button" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className='mr-2' size={16} color='currentColor' />
                        {preview ? 'Change' : 'Add'} Image
                    </Button>

                     {preview && (
                        <Button variant="outline" type="button" onClick={() => setPreview(null)}>
                            <XIcon className='mr-2' size={16} color='currentColor' />
                            Remove Image
                        </Button>
                     )}
                </div>
            </form>

        </div>
    )
}

export default PostForm