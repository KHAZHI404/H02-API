import {Request, Response, Router } from "express";
import { HTTP_STATUSES } from "..";
import {postsRepository} from "../repositories/posts-repositories";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {blogsRepository} from "../repositories/blogs-repositories";
import {authGuardMiddleware} from "../middlewares/auth-guard-middleware";

export const postsRouter = Router({})

const titleValidator = body('title', 'title must be a string and be between 3 and 30 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 30})

const shortDescriptionValidator = body('shortDescription', 'shortDescription must be a string and be between 3 and 100 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 100})


const contentValidator = body('content', 'content must be a string and be between 3 and 1000 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 1000})

const blogIdValidator = body('blogId', 'blogId must be a string and be between 3 and 100 symbol')
    .notEmpty()
    .trim()
    .isString()
    .custom(value => {
        if (!blogsRepository.findBlogById(value)) {
            throw new Error('BlogId is not found')
        }
        return true
    })

const postsValidator = [
    authGuardMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    inputValidationMiddleware,
]

postsRouter.get('/', (req: Request, res: Response) => {
    const findPosts = postsRepository.findAllPosts()
    res.status(HTTP_STATUSES.OK_200).send(findPosts)
})

postsRouter.get('/:postId', (req: Request, res: Response) => {
    const id = req.params.postId
    const post = postsRepository.findPostById(id)
    return post ? res.status(HTTP_STATUSES.OK_200).send(post) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.post('/',
    postsValidator,
    (req: Request, res: Response) => {
    try {
        const {title, shortDescription, content, blogId} = req.body

        const newPost = postsRepository.createPost(title, shortDescription, content, blogId)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)

    } catch (e) {
        console.log(e);
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
})

postsRouter.put('/:postId',
    postsValidator,
    (req: Request, res: Response) => {
    const id = req.params.postId
    const {title, shortDescription, content, blogId} = req.body

    const isUpdated = postsRepository.updatePost(id, title, shortDescription, content, blogId)
    res.sendStatus(isUpdated ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.delete('/:postId',
    authGuardMiddleware,
    (req: Request, res: Response) => {
    const id = req.params.postId
    const isDeleted = postsRepository.deletePost(id)
    res.sendStatus(isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
})

