import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IUser } from "../../types/user";
import { Comment, IComment, ICommentBase } from "./comments";
import { create } from "domain";
import { comment } from "postcss";


// Interfaces define the structure of an object, ensuring type safety.
// Methods are functions associated with objects or classes, defining behaviors.
// Extending allows one interface or class to inherit properties and methods from another, promoting code reuse and expansion.


export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}

// IPost extends IPostBase and Document. It includes all properties from IPostBase and adds createdAt and updatedAt
export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}


// Methods - IPostMethods defines methods that can be called on individual post instances. These methods perform actions such as liking, unliking, commenting, retrieving comments, and removing the post.

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

// static function for all the posts
interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

//IPostDocument combines the properties from IPost and the methods from IPostMethods, representing a complete post document with both data and behavior.
export interface IPostDocument extends IPost, IPostMethods { } // this is for a singular instance of a post

//IPostModel extends Mongoose's Model interface to include IPostDocument, representing the entire collection of posts, including any static methods defined for the model.
interface IPostModel extends IPostStatics, Model<IPostDocument> { } // this is for all the posts



const PostSchema = new Schema<IPostDocument>({
    user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },

    // This defines an array of ObjectIds, each referencing a Comment document. The ref: 'Comment' part tells Mongoose that these ObjectIds refer to documents in the Comment collection.
    // default: [] initializes this array as empty by default.
    // This means each Post document can have an array of comments, with each comment being referenced by its ObjectId
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] }, //will be be an array of ids which ref the comment
    likes: { type: [String] }
})


PostSchema.methods.likePost = async function (userId: string) {

    try {
        await this.updateOne({ $addToSet: { likes: userId } })
    } catch (error) {
        console.log("error liking post", error)
    }
}


PostSchema.methods.unlikePost = async function (userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } })
    } catch (error) {
        console.log("error unliking post", error)
    }
}


PostSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id })
    } catch (error) {
        console.log("error removing post", error)
    }
}


PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
    try {
        const comment = await Comment.create({ commentToAdd })
        this.comments.push(comment._id)
        await this.save()
    } catch (error) {
        console.log("error commenting on post", error)
    }
}


PostSchema.methods.getAllComments = async function () {
    try {
        // populate() is a Mongoose method that replaces the specified path in the document with the actual document(s) from the Comment collection.
        await this.populate({
            path: 'comments',
            options: { sort: { createdAt: -1 }}, //sort comments by createdAt in descending order (most recent first)  
        })
        return this.comments

    } catch (error) {
        console.log("error getting comments", error)
    }
}

PostSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",

                options: { sort: { createdAt: -1 }},
        }).lean() // lean() converts the Mongoose document to a plain JavaScript object, which is more efficient for read-only operations.

        return posts.map((post: IPostDocument) => ({
            ...post,
            _id: post._id.toString(),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: comment._id.toString(),
            })),
        }));
    } catch (error) {
        console.log("error getting posts", error)
    }
};


export const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema) // this is for a singular instance of a post