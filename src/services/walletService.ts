import {IcreateWallet, IFundWallet, ITransferDetails } from "../types"
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

    // public async fund(details: IFundWallet){
    //     const { amount } = details
        
    // }

    // public async withdraw(){

    // }

    // public async transfer(details: ITransferWallet){

    //     const {senderWalletId, receiverWalletId, } = details

    //    try{
    //     const _ = await transferFunds()
    //    }catch(err){

    //    }

    // }
}

const walletService = new WalletService()
export default walletService