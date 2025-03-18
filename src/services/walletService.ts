import {IcreateWallet, IFundWallet, ITransferDetails, IWithdrawWallet } from "../types"
import {serviceWrapper, generateTransactionReference, generateUniqueAccountNumber} from "../utils";
import { NextFunction } from "express";
import db from "../db";
import { BadRequest, NotFound } from "../middlewares/error";
import {Knex} from "knex";




export class WalletService {

    createWallet = serviceWrapper(async(trx: Knex, userDetails: IcreateWallet, next: NextFunction)=>{

        const accountNumber = await generateUniqueAccountNumber(trx)

        await trx("wallets").insert({
            user_id: userDetails.userId,
            account_name: userDetails.accountName,
            account_number: accountNumber
        })

        const wallet = await trx("wallets").select(["id", "account_name", "account_number","account_balance"]).where("account_number", accountNumber).first()
        return wallet
    })

    transferToWallet = serviceWrapper(async(transferDetails: ITransferDetails)=>{

        const {sender, receiver, amount, description} = transferDetails;

        const data =  await db.transaction(async (trx)=>{
            const senderWallet = await trx("wallets").select("*").where("user_id", sender).first()
            const receiverWallet = await trx("wallets").select("*").where("account_number", receiver).first()
    
            if(!receiver) throw new NotFound("Receiver wallet not found")
            if(!sender) throw new NotFound("Receiver wallet not found")
        
    
            if (senderWallet.account_balance < amount) {
                throw new BadRequest("Insufficient balance, Top up your account")
            }
    
            await trx("wallets").where({id: senderWallet?.id}).update({
                "account_balance": trx.raw("account_balance - ?", [amount]),
                "balance_last_updated": trx.fn.now()
            })
            
            await trx("wallets").where({id: receiverWallet?.id}).update({
                "account_balance": trx.raw("account_balance + ?", [amount]),
                "balance_last_updated": trx.fn.now()
            })
    
            const trxReference = `TXN-${generateTransactionReference()}`

            await trx("transactions").insert({
                sender: JSON.stringify({
                    account_name: senderWallet.account_name, 
                    account_number: senderWallet.account_number
                }),
                receiver: JSON.stringify({
                    account_name: receiverWallet.account_name, 
                    account_number: receiverWallet.account_number
                }),

                amount: amount,
                type: "transfer",
                
                reference: trxReference,
                description: description
            })

            const transaction = await trx("transactions").select(["sender", "receiver", "amount", "reference", "description"]).where("reference", trxReference).first()
            return transaction;
        })

        return data
    })

    fundWallet = serviceWrapper(async(fundDetails: IFundWallet)=>{
        const {email, amount, reference} = fundDetails;

        const completed = await db.transaction(async (trx)=>{

            const user = await trx("users").select("id").where("email", email).first()
        
            if(!user) throw new NotFound("user not found")

            await trx("wallets").where("user_id", user?.id).update({
                "account_balance": trx.raw("account_balance + ?", [amount]),
                "balance_last_updated": trx.fn.now()
            })

            const userWallet = await trx("wallets").select("*").where("user_id", user?.id).first()

            await trx("transactions").insert({
                sender: null,
                receiver: JSON.stringify({
                    account_name: userWallet?.account_name, 
                    account_number: userWallet?.account_number
                }),
                amount: amount,
                type: "deposit",    
                reference: reference,
                description: null
            })


            return user?.id
        })
        return completed
    })


    withdrawal = serviceWrapper(async(withdrawalDetails: IWithdrawWallet)=>{
        const {userId, amount, receiver, description} = withdrawalDetails;

        const completed = await db.transaction(async (trx)=>{

            const wallet = await trx("wallets").select("*").where("user_id", userId).first()
        
            if(!wallet) throw new NotFound("wallet not found")

            if(wallet?.account_balance < amount){
                throw new BadRequest("Insufficient balance, Top up your account")
            }

            await trx("wallets").where("id", wallet?.id).update({
                "account_balance": trx.raw("account_balance - ?", [amount]),
                "balance_last_updated": trx.fn.now()
            })

            // const userWallet = await trx("wallets").select("*").where("user_id", userId).first()
            const reference = `TXN-${generateTransactionReference()}`
            await trx("transactions").insert({
        
                sender: JSON.stringify({
                    account_name: wallet?.account_name, 
                    account_number: wallet?.account_number
                }),
                receiver: JSON.stringify({
                    account_name: receiver?.account_name, 
                    account_number: receiver?.account_number
                }),
                amount: amount,
                type: "withdrawal",    
                reference: reference,
                description: description
            })
            const transaction = await trx("transactions").select(["sender", "receiver", "amount", "reference", "description"]).where("reference", reference).first()
            const walletUpdate = await trx("wallets").select("account_balance").where("user_id", userId).first()
            return {transaction, balance: walletUpdate?.account_balance};
        })
        return completed
    })


   
}

const walletService = new WalletService()
export default walletService