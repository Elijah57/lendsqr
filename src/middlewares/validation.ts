import { ZodError, ZodTypeAny } from "zod";
import { NextFunction, Request, Response,  } from "express";
import { ServerError } from "./error";

export const validateInput = (schema: ZodTypeAny)=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        try{
            schema.parse(req.body)
            next();
        } catch(err){
            if(err instanceof ZodError){
                res.status(400).json({status: false, error: err})
            }else{
                throw new ServerError("Internal Server Error")
            }
        }
    }
}