import { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode){
        super(message)
        this.statusCode = statusCode
        this.name = this.constructor.name
    }

}

export class BadRequest extends HttpError{
    constructor(message: string){
        super(message, 400)
    }
}

export class UnAuthorized extends HttpError{
    constructor(message: string){
        super(message, 401)
    }
}

export class Forbidden extends HttpError{
    constructor(message: string){
        super(message, 403)
    }
}

export class NotFound extends HttpError{
    constructor(message: string){
        super(message, 409)
    }
}

export class Conflict extends HttpError{
    constructor(message: string){
        super(message, 409)
    }
}

export class RateLimit extends HttpError{
    constructor(message: string){
        super(message, 429)
    }
}

export class UnProcessable extends HttpError{
    constructor(message: string){
        super(message, 422)
    }
}

export class ServerError extends HttpError{
    constructor(message: string){
        super(message, 500)
    }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction)=>{
    const message = `Route not found: ${req.originalUrl}`
    res.status(404).json({message})
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction)=>{
    const message: string = err?.message;
    const statusCode = err?.statusCode || 500;

    const cleanedMessage = message.replace(/"/g, "")
    res.status(statusCode).json({status: false, message})
}