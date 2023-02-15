import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../index";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array({onlyFirstError: true}).map(elem => {
            return {
                message: elem.msg,
                field: elem.param
            }
        })
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({"errorsMessages": error})
    } else {
        next()
    }
}