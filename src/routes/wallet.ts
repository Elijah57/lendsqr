import { Router } from "express";
import { preFundWallet, transferTo, verifyFundPayment, getWallet, getTransactions, bankResolve, withdrawal } from "../controllers/wallet";
import { isLoggedIn } from "../middlewares/auth";
import { initializePayment } from "../controllers/paystack";


export const walletRouter = Router()

walletRouter.get("/", isLoggedIn, getWallet)
walletRouter.get("/transactions", isLoggedIn, getTransactions)
walletRouter.post("/transfer-to", isLoggedIn, transferTo)
walletRouter.post("/withdrawal", isLoggedIn, withdrawal)
walletRouter.post("/fund", isLoggedIn, preFundWallet, initializePayment)
walletRouter.get("/verify-payment", verifyFundPayment)
walletRouter.get("/bank-resolve", bankResolve)