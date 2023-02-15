import {Router, Request, Response} from "express";
import {blogs} from "../repositories/blogs-repositories"
import {posts} from "../repositories/posts-repositories"
import {HTTP_STATUSES} from "../index";

export const deleteAllRouter = Router()

deleteAllRouter.delete('/all-data', (req: Request, res: Response) => {
    blogs.splice(0, blogs.length)
    posts.splice(0, posts.length)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})