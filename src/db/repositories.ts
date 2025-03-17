import { Knex } from "knex";
import db from ".";

export async function findUserByEmail(email:string) {
	return await db("users").select(["id", "email", "passwordhash"]).where("email",email).first()
}

export async function getUserWallet(userId: string){
	return await db("wallets").select("*").where("user_id", userId).first()
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
	
