import { Request, Response, NextFunction } from "express";


type Middlewarefn = (req: Request, res: Response, next: NextFunction)=> Promise<any> | void;

const asyncWrapper = (fn:Middlewarefn)=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        Promise.resolve(fn(req, res, next)).catch((err)=>next(err))
    }
}

export default asyncWrapper;