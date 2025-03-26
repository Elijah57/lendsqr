import { Router } from "express";
import { preFundWallet, transferTo, verifyFundPayment, getWallet, getTransactions, bankResolve, withdrawal } from "../controllers/wallet";
import { isLoggedIn } from "../middlewares/auth";
import { initializePayment } from "../controllers/paystack";
import { bankResolveSchema, fundSchema, transferSchema, withdrawSchema } from "../schema/wallet.validation";
import { validateInput } from "../middlewares/validation";

export const walletRouter = Router()

walletRouter.get("/", isLoggedIn, getWallet)
walletRouter.get("/transactions", isLoggedIn, getTransactions)
walletRouter.post("/transfer-to", isLoggedIn, validateInput(transferSchema), transferTo)
walletRouter.post("/withdrawal", isLoggedIn, validateInput(withdrawSchema), withdrawal)
walletRouter.post("/fund", isLoggedIn, validateInput(fundSchema),preFundWallet, initializePayment)
walletRouter.get("/verify-payment", verifyFundPayment)
walletRouter.get("/bank-resolve", validateInput(bankResolveSchema), bankResolve)