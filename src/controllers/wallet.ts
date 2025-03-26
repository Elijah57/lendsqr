import { NextFunction, Response, Request } from "express";
import { paystackResolveBank, paystackVerifyPayment } from "./paystack";
import walletService from "../services/walletService";
import { asyncReqWrapper } from "../utils";
import { BadRequest, NotFound, ServerError } from "../middlewares/error";
import { IAccountDetails, IBankResolveResponse, ITransferDetails } from "../types";
import { findUserById, getUserWallet, getUserWalletTransactions, getUserWithWallet } from "../db/repositories";
import db from "../db";

export const getWallet = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.userId
    
    const wallet = await getUserWallet(userId)
    if(!wallet) throw new NotFound("wallet not found")
    res.status(200).json({status: true, wallet})
})


export const getTransactions = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.userId
    
    const transactions = await getUserWalletTransactions(userId)

    res.status(200).json({status: true, transactions})
})


export const transferTo = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{
    let {receiver, amount, description } = req.body;

    amount = Number(amount)

    if(!receiver || isNaN(amount)){
        return next(new BadRequest("Invalid input"))
    }

    const senderUid = req.user?.userId

    const transferToPayload: ITransferDetails = {sender: senderUid, receiver, amount, description}

    const data = await walletService.transferToWallet(transferToPayload)

    res.status(200).json({status: true, message: "money sent", data})
})

export const preFundWallet = asyncReqWrapper(async(req: Request, res: Response, next: NextFunction)=>{

    const { amount } = req.body;
   
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

    const response = await paystackVerifyPayment(req.query.reference as string);

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
        amount: data.amount / 100,
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


export const bankResolve = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    
    const {account_number, bank_name} = req.body as IAccountDetails
    if(!account_number || !bank_name){
        return next(new BadRequest('All fields are required'))
    }
    const response:IBankResolveResponse = await paystackResolveBank({account_number, bank_name})

    if(!response){
        return next(new NotFound("Account Details not found"))
    }

    if(!response.status){
        throw new NotFound(`Failed to retrieve account details`)
    }
   
    return res.status(200).json({
        message: response.message,
        data: response.data
    });

});


export const withdrawal = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    
    const {account_number, bank_name, amount, description} = req.body
    if(!amount || isNaN(amount)){
        return next(new BadRequest("Invalid amount format"))
    }

    if(!account_number || !bank_name){
        return next(new BadRequest("Bank name and account number are required"))
    }
    const response:IBankResolveResponse= await paystackResolveBank({account_number, bank_name})

    if(!response){
        return next(new NotFound("Account Details not found"))
    }

    if(!response.status){
        throw new NotFound(`Failed to retrieve account details`)
    }
    const receiver = {
        account_number: response.data.account_number,
        account_name: response.data.account_name
    }
    const withdrawalDetails = {userId: req.user?.userId, amount, receiver, description}
    const complete = await walletService.withdrawal(withdrawalDetails)

    return res.status(200).json({
        status: true,
        data: complete,

    })

});







// TODO: Paystack withdrawal strategy

// export const preWithdrawal = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    
//     const {account_number, bank_name} = req.body as IAccountDetails
//     const response:IBankResolveResponse= await paystackResolveBank({account_number, bank_name})

//     if(!response){
//         return next(new NotFound("Account Details not found"))
//     }

//     if(!response.status){
//         throw new NotFound(`Failed to retrieve account details`)
//     }
    
//     req.user.preWithdrawal = response

// });


// export const createTransferReceiptForWithdrawal = asyncReqWrapper(async (req: Request, res: Response, next: NextFunction)=>{
    
//     const preWithdrawal: IBankResolveResponse = req.user?.preWithdrawal
//     const transferReciptDetails: ITransferReceipt = {
//         type: "nuban",
//         name: preWithdrawal.data.account_name,
//         account_number: preWithdrawal.data.account_number,
//         bank_code: preWithdrawal.bank_code,
//         currency: "NGN"
//     }
//     const response:ITransferReceiptResponse = await paystackTransferRecipient(transferReciptDetails)
    
//     if(!response){
//         return next(new NotFound("Account Details not found"))
//     }

//     if(!response.status){
//         throw new NotFound(`Failed to retrieve account details`)
//     }
    
//     req.user.preWithdrawal = response

// });


