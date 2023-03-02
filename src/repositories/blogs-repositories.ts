import { v4 } from "uuid";
import {blogsCollection, BlogsType} from "../db/db";


type BlogsViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership?: boolean
}
export const blogsRepository = {

    async findAllBlogs(): Promise<BlogsType[]> {
        const blogs = await blogsCollection.find().toArray()
        return blogs.map((blog) => ({
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: false
        }))
    },

    async findBlogById(id: string): Promise<BlogsViewType | null> {
        return blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsViewType | null> {
        const dateNow = new Date()
        const newBlog = {
            id: v4(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false
        }
        await blogsCollection.insertOne(newBlog)
        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl:string) {
         const result =  await blogsCollection.updateOne({id: id}, {$set: {
            name: name,
                 description: description,
                 websiteUrl: websiteUrl
            }} )
        return result.matchedCount === 1
    },

    async deleteBlogs(id: string) {
        const isDel = await blogsCollection.deleteOne({id: id})
        return isDel.deletedCount === 1
    }

}