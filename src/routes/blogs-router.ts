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

const blogsPostAndPutValidator = [
    authGuardMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware
]

blogsRouter.get('/', (req: Request, res: Response) => {
    const findBlogs = blogsRepository.findAllBlogs()
    res.status(HTTP_STATUSES.OK_200).send(findBlogs)
})

blogsRouter.post('/',
    blogsPostAndPutValidator,
    (req: Request, res: Response) => {
        try {
        const name = req.body.name
        const description = req.body.description
        const websiteUrl = req.body.websiteUrl

        const newBlogs = blogsRepository.createBlog(name, description, websiteUrl)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlogs)
    } catch (e) {
        console.log(e);
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
})

blogsRouter.get('/:blogId', (req: Request, res: Response) => {
    const id = req.params.blogId
    const blog = blogsRepository.findBlogById(id)
    return blog ? res.status(HTTP_STATUSES.OK_200).send(blog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

blogsRouter.put('/:blogId',
    blogsPostAndPutValidator,
    (req: Request, res: Response) => {
    const id = req.params.blogId
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const isUpdated = blogsRepository.updateBlog(id, name, description, websiteUrl)
    isUpdated ? res.send(blogsRepository.findBlogById(id)) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

blogsRouter.delete('/:blogId', (req: Request, res: Response) => {
    const id = req.params.blogId
    const isDeleted = blogsRepository.deleteBlogs(id)
    isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
