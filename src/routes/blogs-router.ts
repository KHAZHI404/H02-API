import {Request, Response, Router } from "express";
import { HTTP_STATUSES } from "..";
import {blogsRepository} from "../repositories/blogs-repositories"
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authGuardMiddleware} from "../middlewares/auth-guard-middleware";
export const blogsRouter = Router({})

const nameValidation = body('name', 'name must be a string and between 3 and 15 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 15})

const descriptionValidation = body('description', 'description must be a string and between 3 and 500 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 500})

const websiteUrlValidation = body('websiteUrl', 'websiteUrl must be a url and between 3 and 100 symbol')
    .notEmpty()
    .trim()
    .isString()
    .isLength({min: 3, max: 100})
    .isURL()

const blogsValidator = [
    authGuardMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
]

blogsRouter.get('/', async (req: Request, res: Response) => {
    const findBlogs = await blogsRepository.findAllBlogs()
    res.status(HTTP_STATUSES.OK_200).send(findBlogs)
})

blogsRouter.get('/:blogId', async (req: Request, res: Response) => {
    const id = req.params.blogId
    const blog = await blogsRepository.findBlogById(id)
    if(blog) {
        res.status(HTTP_STATUSES.OK_200).send(blog)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
})

blogsRouter.post('/',
    blogsValidator,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
            const {name, description, websiteUrl} = req.body
            const newBlog = await blogsRepository.createBlog(name, description, websiteUrl)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})

blogsRouter.put('/:blogId',
    blogsValidator,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const id = req.params.blogId
    const {name, description, websiteUrl} = req.body
    const isUpdated = await blogsRepository.updateBlog(id, name, description, websiteUrl)
    res.sendStatus(isUpdated ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
    })

blogsRouter.delete('/:blogId',
    authGuardMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const id = req.params.blogId
    const isDeleted = await blogsRepository.deleteBlogs(id)
    res.sendStatus(isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
    })
