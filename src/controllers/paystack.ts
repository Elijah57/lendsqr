import { Request, Response } from "express";
import paystackApi from "../api/paystackApi";
import {asyncReqWrapper} from "../utils";

import { verifyPaymentReferenceResponse } from "../types";
import { BadRequest } from "../middlewares/error";
import walletService, { WalletService } from "../services/walletService";



export const initializePayment = asyncReqWrapper(async (req:Request, res: Response)=>{

    const userDetails = req.user?.paymentDetails
    
    const paymentDetails = {
        email: userDetails?.email,
        amount: userDetails?.amount,
        // callback_url: userDetails?.callbackUrl, // deprecated paystack no longer uses this
        metadata: {
            email: userDetails?.email,
            amount: userDetails?.amount,
            name: userDetails?.name
        }

    }
    
    const data = await paystackApi.initializePayment(paymentDetails);
    return res.status(200).json({message: "Payment Initialized successfully",data})

});

export const verifyPayment = async (reference: string)=>{
    
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
};
