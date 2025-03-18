import express from "express"
import { authRouter, walletRouter } from "./routes"
import { errorHandler, RouteNotFoundHandler } from "./middlewares/error"
import cors from "cors"
import configs from "./configs"
export const app = express()
app.use(express.json())

app.use(cors(configs.corsOptions))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/wallet", walletRouter)

app.use(RouteNotFoundHandler)
app.use(errorHandler)