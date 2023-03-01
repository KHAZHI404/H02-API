import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsCollection, postsCollection} from "../db/db";

export const deleteAllRouter = Router()

deleteAllRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})