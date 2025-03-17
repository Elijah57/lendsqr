import { NextFunction, Response, Request } from "express";
import { verifyPayment } from "./paystack";
import walletService from "../services/walletService";
import { asyncReqWrapper } from "../utils";
import { BadRequest, ServerError } from "../middlewares/error";
import { ITransferDetails } from "../types";
import { findUserById, getUserWithWallet } from "../db/repositories";
import db from "../db";


export const transferTo = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{
    let {receiver, amount, description } = req.body;

    amount = Number(amount)

    if(!receiver || isNaN(amount)){
        return next(new BadRequest("Invalid input"))
    }

    const senderUid = req.user?.userId

    const transferToPayload: ITransferDetails = {sender: senderUid, receiver, amount, description}

    const data = await walletService.transferToWallet(transferToPayload)

    res.status(200).json({status: true, data})
})

export const preFundWallet = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{

    const { amount, } = req.body;
    const paymentAmount = (amount * 100).toString();

    const userId = req.user?.userId
    const user = await findUserById(userId)
    
    const paymentDetails = {
        email: user?.email,
        amount: paymentAmount,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
            email: user?.email,
            amount: paymentAmount,
            name: user?.firstname + " " + user?.lastname
        }
    }
    req.user.paymentDetails = paymentDetails
    next()
})

export const verifyFundPayment = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    
    if(!req.query.reference) throw new BadRequest("Transaction Reference missing")

    const response = await verifyPayment(req.query.reference as string);

    const data = {
        metadata: response.metadata,
        status: response.status,
        reference: response.reference,
        amount: response.amount
    }

    if(data.status !== "success"){
        throw new BadRequest(`Transaction: ${data.status}`)
    }

    const fundDetails = {
        email: data.metadata.email,
        amount: data.amount,
        reference: data.reference
    }

    const user = await walletService.fundWallet(fundDetails)
    const updatedData = await getUserWithWallet(db, user)

    if(!user){
        return next(new ServerError("Transaction not complete"))
    }

    return res.status(200).send({
        message:"Payment Verified, Account credited",
        updatedData
    });

});
