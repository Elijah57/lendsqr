import { Knex } from "knex";
import db from ".";
import paystackApi from "../api/paystackApi";


export async function fetchBankCode(bank_name: string){
	return await db("banks").where("name", bank_name).select("code").first();
}

export async function findUserByEmail(email:string) {
	return await db("users").select(["id", "email", "passwordhash"]).where("email",email).first()
}

export async function findUserById(userId:string) {
	return await db("users").select(["id", "email", "firstname", "lastname"]).where("id",userId).first()
}

export async function getUserWallet(userId: string){
	return await db("wallets").select("*").where("user_id", userId).first()
}

export async function getUserWalletTransactions(userId: string){
	const wallet = await db("wallets").select("account_number").where("user_id", userId).first()
	
	const transactions = await db("transactions")
  	.whereRaw("JSON_EXTRACT(sender, '$.account_number') = ?", [wallet?.account_number])
  	.orWhereRaw("JSON_EXTRACT(receiver, '$.account_number') = ?", [wallet?.account_number]);
	
	return transactions
}

export const getUserWithWallet = async (db:Knex,userId: string) => {
	const user = await db('users')
		.join('wallets', 'users.id', 'wallets.user_id')
		.select(
			'users.id as userId',
			'users.firstname',
			'users.lastname',
			'users.email',
			'wallets.id as walletId',
			'wallets.account_balance',
			'wallets.account_number',
			'wallets.account_name',
			'wallets.balance_last_updated'
		)
		.where('users.id', userId)
		.first(); 
	
	return user;
};
	

export async function fetchAndStoreBanksCode() {
    try{

        const response = await paystackApi.getBankCode()
        const banks = response?.data;
    
        console.log(banks)
            
		for (const bank of banks) {
			await db("banks").insert({
				name: bank.name,
				code: bank.code,
				slug: bank.slug,
				longcode: bank.longcode,
				country: bank.country,
				currency: bank.currency
			}).onConflict("code").merge();
		}
    
        console.log("Banks updated successfully");
       
    }catch(err){
        console.log(err)
        throw err
    }
}
