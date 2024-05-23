'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData: FormData) {

    // we can use the below auth().protect() example to protect the route, but will not be able to control the error message
    // auth().protect();

    //this checks the current user and if it doesn't exist, throws an error
    const user = await currentUser();

    if (!user) {
        throw new Error('User not found')
    }

    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;

    // we use a let below as value could be either a string or undefined
    let imageUrl: string | undefined


    // if no post input, throw an error
    if (!postInput) {
        throw new Error('Post cannot be empty')
    }

    //define user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    }


    try {
        if (image.size > 1) {

            // TODO: upload to storage

        } else {

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput
            }
            await Post.create(body)
        }

    } catch (error: any) {
        throw new Error('Error creating post', error);
    }
    // upload image if there is one

    //create post in database

    // revalidate the path/homepage so that all the data reloads


}