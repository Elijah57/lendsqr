import { ISignup, IUsers, Ilogin } from "../types";
import db from "../db";
import { HttpError, NotFound, UnAuthorized } from "../middlewares/error";
import { hashPassword, isPasswordMatched, generateAcessToken, generateRefreshToken , serviceWrapper} from "../utils";
import walletService, { WalletService } from "./walletService";
import { findUserByEmail } from "../db/repositories";



class AuthService {

    private readonly walletService;

    constructor(wallet: WalletService){
        this.walletService = wallet
    }

    signup = serviceWrapper<{user: IUsers; walletId: any[]}>(async (payload: ISignup)=>{

        const { firstname, lastname, phoneno, email, password} = payload
  
        const user = await findUserByEmail(email)
        if(user) throw new HttpError("User already exists", 400)

        const hashedPassword = await hashPassword(password)

        const data = await db.transaction(async (trx)=>{
            
            await trx("users").insert({
                firstname: firstname,
                lastname: lastname,
                phoneno: phoneno,
                email: email,
                passwordhash: hashedPassword
            })

            const user = await trx("users").select(["id", "firstname", "lastname"]).where("email", email).first()

            const userDetails = {
                userId: user?.id,
                accountName: user.firstname + " " + user.lastname
            }
            
            const wallet = await this.walletService.createWallet(trx, userDetails)
            return {user: user, walletId: wallet}
        })
        console.log(data)
        return data
       

    })

    login = serviceWrapper(async(payload:Ilogin)=>{

            const user = await findUserByEmail(payload.email)
            if(!user){
                throw new NotFound("user does not exists")
            }
        
            const isMatched = await isPasswordMatched(user.passwordhash, payload.password)
            if(!isMatched){
                throw new UnAuthorized("Invalid credentials")
            }
        
            const authPayload = {id: user.id, email:user.email}
        
            const accessToken = generateAcessToken(authPayload)
            const refreshToken = generateRefreshToken(authPayload)
        
            return {accessToken, refreshToken}
        })
        
}


const authService = new AuthService(walletService)

export default authService;