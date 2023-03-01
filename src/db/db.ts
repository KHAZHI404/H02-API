import {MongoClient} from "mongodb"
import dotenv from 'dotenv'
dotenv.config()

export type BlogsType = {
    //_id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}
export type PostsType = {
    //id:  string,
    title:  string,
    shortDescription:  string,
    content:  string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log('url:', process.env.MONGO_URL)
const client = new MongoClient(mongoURI)

export const blogsCollection = client.db().collection<BlogsType>('blogs')
export const postsCollection = client.db().collection<PostsType>('posts')

export const runDb = async () => {
    try {
        await client.connect();
        await client.db('blogs').command({ping:1})
        console.log('Connected successfully to server')
    } catch (e) {
        console.log('Dont connected to server')
        await client.close()
    }
}