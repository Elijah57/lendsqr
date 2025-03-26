import express from "express"
import { authRouter, walletRouter } from "./routes"
import { errorHandler, RouteNotFoundHandler } from "./middlewares/error"
import cors from "cors"
import rateLimit from "express-rate-limit"
import configs from "./configs"


export const app = express()

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5,
    message: { error: "Too many login attempts, please try again later." },
});

app.use(express.json())

app.use(cors(configs.corsOptions))

app.use("/api/v1/auth", authLimiter, authRouter)
app.use("/api/v1/wallet", walletRouter)



app.use(RouteNotFoundHandler)
app.use(errorHandler)