import { Request, Response, NextFunction } from "express";


type Middlewarefn = (req: Request, res: Response, next: NextFunction)=> Promise<any> | void;

const asyncReqWrapper = (fn:Middlewarefn)=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        Promise.resolve(fn(req, res, next)).catch((err)=>next(err))
    }
}

export default asyncReqWrapper;