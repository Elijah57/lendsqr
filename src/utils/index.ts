import { randomInt } from "crypto";
import * as argon2 from "argon2";
import jwt, { SignOptions} from "jsonwebtoken";
import { IAuthPayload } from "../types";
import {Knex} from "knex";
import type { StringValue } from "ms";

export async function hashPassword (password: string){
    return await argon2.hash(password)
}


export async function isPasswordMatched (hashedPassword: string, password: string): Promise<Boolean>{
    return argon2.verify(hashedPassword, password)
}

export const generateAcessToken = (payload: IAuthPayload)=>{
    const jwtExpiry = process.env.JWT_EXPIRY || "1d";
    return jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: jwtExpiry as StringValue })
}

export const generateRefreshToken = (payload: IAuthPayload)=>{
    const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY || "15m";
    return jwt.sign( payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: jwtRefreshExpiry as StringValue})
}



export function generateTransactionReference(): string {
    const now = new Date();
    const datePrefix = now.getFullYear().toString().slice(2) + String(now.getMonth() + 1).padStart(2, "0")+ String(now.getDate()).padStart(2, "0");
    const randomPart = String(randomInt(1e10, 9e10))
    const checksum = String(randomInt(100, 990))
    return datePrefix + randomPart + checksum
}


export async function generateUniqueAccountNumber(db: Knex) {
    let accountNumber;
    let exists = true;
  
    while (exists) {
      accountNumber = (Math.floor(1000000000 + Math.random() * 9000000000)).toString();
  
      const existingWallet = await db("wallets").where("account_number", accountNumber).first();
      exists = !!existingWallet;
    }
  
    return accountNumber;
  }


export * from "./asyncWrapper"
export * from "./serviceWrapper"