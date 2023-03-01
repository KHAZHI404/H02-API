import { blogsRouter } from "./routes/blogs-router"
import { postsRouter } from "./routes/posts-router"
import express from 'express';
import {deleteAllRouter} from "./routes/delete-all-router";
import { runDb } from "./db/db";

const app = express()
const port = process.env.PORT || 5001
app.use(express.json())

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    NOT_AUTHORIZED_401: 401
}

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', deleteAllRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()