import { Request, Response } from "express";
import paystackApi from "../api/paystackApi";
import {asyncReqWrapper, serviceWrapper} from "../utils";
import { BadRequest } from "../middlewares/error";
import { IAccountDetails, IBankresolve, ITransferReceipt, ITransferReceiptResponse } from "../types";
import { fetchBankCode } from "../db/repositories";



export const initializePayment = asyncReqWrapper(async (req:Request, res: Response)=>{

    const userDetails = req.user?.paymentDetails
    
    const paymentDetails = {
        email: userDetails?.email,
        amount: userDetails?.amount,
        callback_url: userDetails?.callbackUrl,
        metadata: {
            email: userDetails?.email,
            amount: userDetails?.amount,
            name: userDetails?.name
        }
    }
    
    const data = await paystackApi.initializePayment(paymentDetails);
    return res.status(200).json({message: "Payment Initialized successfully",data})

});

export const paystackVerifyPayment = serviceWrapper(async (reference: string)=>{

    const response = await paystackApi.verifyPayment(reference);

    const data = {
        metadata: response.data.metadata,
        status: response.data.status,
        reference: response.data.reference,
        amount: response.data.amount
    }

    if(data.status !== "success"){
        throw new BadRequest(`Transaction: ${data.status}`)
    }
    return data

});


export const paystackResolveBank = serviceWrapper(async(accountDetails: IAccountDetails)=>{
    
    const bank = await fetchBankCode(accountDetails.bank_name)
    if (!bank) throw new Error("Invalid bank");
    const code = bank?.code
    const resolve: IBankresolve = {account_number: accountDetails.account_number, bank_code: code}
    
    const response = await paystackApi.bankResolve(resolve)
    response.bank_code = code
    return response

});

export const paystackTransferRecipient = serviceWrapper(async(transferReciptDetails: ITransferReceipt)=>{

    const response:ITransferReceiptResponse = await paystackApi.createTransferReceipt(transferReciptDetails)
    
    return response

})