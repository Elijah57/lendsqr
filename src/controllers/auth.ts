import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import {asyncReqWrapper} from "../utils";
import { BadRequest } from "../middlewares/error";
import { ISignup, Ilogin } from "../types";
import adjutorAPI from "../api/adjutor";



export const signup = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    const {firstname, lastname, email, phoneno, password} = req.body;

    if(!firstname || !lastname || !email){
        return next(new BadRequest("All fields are required"))
    }

    // TODO: calls to Karma API returns 500 - Internal server Error
    // Hence, i could not complete this logic, screenshot of this error can be found in the ReadMeTrouble
    // const isKarma = await adjutorAPI.verifyKarma(email)
    // console.log(isKarma)

    const userPayload: ISignup= {firstname, lastname, phoneno,email, password}
    const userDetails = await authService.signup(userPayload)
    res.status(200).json({
        status: true,
        message: "User registered successfully",
        userDetails
    })
})

export const login = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    const {email, password} = req.body;
    if(!password || !email){
        return next(new BadRequest("All fields are required"))
    }

    const loginPayload: Ilogin = {email, password}
    const payload = await authService.login(loginPayload)

    res.cookie("accessToken", payload?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD",
        sameSite: "strict",
        maxAge:  5 * 60 * 1000,
    });
    
    res.cookie("refreshToken", payload?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    
    res.status(200).json({ message: "Login successful" });   
})