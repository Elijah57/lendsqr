import { NextFunction, Request, Response,  } from "express";
import jwt from "jsonwebtoken";
import { asyncReqWrapper } from "../utils"
import { IAuthPayload} from "../types";
import { UnAuthorized, ServerError } from "./error";
import dotenv from "dotenv";
dotenv.config();

export const isLoggedIn = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{

    const token = req.headers.authorization?.split(" ")[1]!;
    if(!token) next( new UnAuthorized("unauthorized, please login to continue"))

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as any) as IAuthPayload
        req.user = {
            userId: decode.id,
            email: decode.email
        } 
        next();
    }
    catch (error: any) {
        if (error.name === 'TokenExpiredError') next(new UnAuthorized("Token has expired, please login again" ));
        else if (error.name === 'JsonWebTokenError') next(new UnAuthorized("Invalid token, please login again"));
        else { next (new ServerError("Internal server error"));}
    }
})

