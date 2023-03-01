import {blogsRepository} from "./blogs-repositories";
import {postsCollection, PostsType} from "../db/db";

type PostViewType = {
    id:  string,
    title:  string,
    shortDescription:  string,
    content:  string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
export const postsRepository = {

    async findAllPosts(): Promise<PostsType[]> {
        return await postsCollection.find().toArray()
    },

    async findPostById(id: string) :Promise<PostViewType | null> {
        const post = await postsCollection.findOne({id: id})
        if (!post) {return null}
        return {
            id: id,
            title: post.title,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: post.blogName,
            content: post.content,
            createdAt: post?.createdAt
        }
    },

    async createPost(id: string, title: string, shortDescription: string, content: string, blogId: string ): Promise<PostViewType | null> {
        const dateNow = new Date()
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return null
        const newPost = {
            id: (+dateNow).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: dateNow.toISOString()
        }
        await postsCollection.insertOne(newPost)
        return {
            id: id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName:newPost.blogName,
            createdAt: newPost.createdAt
        }

    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) :Promise<PostViewType | null | boolean> {
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return  null
        // const post = await postsCollection.findOne({id: id})
        // if (!post) {
        //     return false
        // } else {
        //     post.title = title
        //     post.shortDescription = shortDescription
        //     post.content = content
        //     post.blogId = blogId
        //     post.blogName = blog.name
        //     post.createdAt = new Date().toISOString()
        //     return true
        // }
        const result = await postsCollection.updateOne({id: id}, {$set: {
            title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }})
        return result.matchedCount === 1
    },

    async deletePost(id: string) {
        const isDel = await postsCollection.deleteOne({id: id})
        return isDel.deletedCount === 1
    }

}
