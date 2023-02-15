import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";

const users = {
    login: 'admin',
    password: 'qwerty'
}
export const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const someUser = req.headers.authorization
    const auth = Buffer.from(`${users.login}:${users.password}`).toString('base64')
    const validAuth = `Basic ${auth}`
    if (validAuth !== someUser) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
    next()
}