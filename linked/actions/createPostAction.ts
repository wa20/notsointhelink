'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"
import { BlobServiceClient } from "@azure/storage-blob";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { randomUUID } from "crypto";

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
    let image_url: string | undefined = undefined;


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

            console.log('image blob uploaded to Azure Storage: ', image)
            // TODO: upload to storage

            // 1. upload image if it exists to Azure Storage
            const accountName = process.env.AZURE_STORAGE_NAME;
            const sasToken = await generateSASToken();

            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net${sasToken}`
            );

            const containerClient = blobServiceClient.getContainerClient(containerName);

            const timestamp = new Date().getTime();
            const file_name = `${randomUUID()}-${timestamp}.png`

            // this will push data to our container
            const blockBlobClient = containerClient.getBlockBlobClient(file_name);

            const imageBuffer = await image.arrayBuffer();
            const res = await blockBlobClient.uploadData(imageBuffer);
            image_url = res._response.request.url

            console.log('image url uploaded: ', image_url)

            // 2. create a post in the database with the image url

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                imageUrl: image_url
            }
            await Post.create(body)

        } else {

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput
            }
            await Post.create(body)
        }

    } catch (error: any) {
        throw new Error('Error creating post - actions', error);
    }
    // upload image if there is one

    //create post in database

    // revalidate the path/homepage so that all the data reloads


}