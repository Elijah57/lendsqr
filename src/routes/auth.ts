import { Router } from "express";
import { login, signup } from "../controllers/auth";
import {signupSchema, loginSchema} from "../schema/auth.validation"
import { validateInput } from "../middlewares/validation";

export const authRouter = Router()

authRouter.post("/signup", validateInput(signupSchema), signup)
authRouter.post("/login", validateInput(loginSchema), login)

