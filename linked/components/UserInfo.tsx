
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from './ui/button';
import { IPostDocument } from '@/mongodb/models/post';

async function UserInfo({ posts }: { posts: IPostDocument[] }) {
    const user = await currentUser();
    // console.log('user', user)

    const firstName = user?.firstName
    const lastName = user?.lastName
    const imageUrl = user?.imageUrl


    const userPosts = posts?.filter((post) => post.user.userId === user?.id)

    // The flatMap() method creates a new array by calling a function for each element in the array and then flattening the result into a new array. It is identical to a map() 
    // followed by a flat() of depth 1, but flatMap() is often quite useful, as merging both into one method is slightly more efficient. The result of this flatMap() is a new array 
    // that contains all comments made by the current user across all posts. It's "flat" because it's a single-level array, not an array of arrays.(should usually be done on server 
    // side and not client side) 

    const userComments = posts.flatMap(
        (post) =>
            post?.comments?.filter((comment) =>
                comment.user.userId === user?.id
            ) || [])



    return (
        <div className='flex flex-col justify-center items-center bg-white mr-6 rounded-lg py-4'>
            <Avatar>
                {user?.id ? (
                    <AvatarImage src={imageUrl} />
                ) : (
                    <AvatarImage src={"https://github.com/shadcn.png"} />
                )}

                <AvatarFallback>
                    {firstName?.charAt(0)} {lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <SignedIn>
                <div className='text-center'>
                    <p className='font-semibold'>
                        {firstName} {lastName}
                    </p>
                    <p className='text-xs'>
                        @{firstName} {lastName} - {user?.id?.slice(-4)}
                    </p>
                </div>
            </SignedIn>

            <SignedOut>
                <div className='text-center space-y-2'>
                    <p className='font-semibold'>Not signed in.</p>
                    <Button asChild className="bg-[#0b63c4] text-white hover:shadow-xl active:scale-90 duration-150">
                        <SignInButton>Sign In</SignInButton>
                    </Button>

                </div>
            </SignedOut>

            <SignedIn>
                <hr className='w-full border-gray-200 my-5' />

                <div className='flex justify-between w-full px-4 text-sm'>
                    <p className='font-semibold text-gray-400'>Posts</p>
                    <p className='text-blue-400'>{userPosts.length}</p>
                </div>
                <div className='flex justify-between w-full px-4 text-sm'>
                    <p className='font-semibold text-gray-400'>Comments</p>
                    <p className='text-blue-400'>{userComments.length}</p>
                </div>
            </SignedIn>


        </div>
    )
}

export default UserInfo