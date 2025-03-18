import config from "../configs";
import { IKarmaResponse} from "../types";
import BaseAPI from "./baseApi";

class AdjutorAPI extends BaseAPI{

    RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`
        }
    }
    constructor(){
        super(config.adjutorUrl)
    }

    verifyKarma = async (userEmail: string)=>{
        const response = await this.get<IKarmaResponse>(`/verification/karma/${userEmail}`, undefined, this.RequestInit)
        return response
    }
}

const adjutorAPI = new AdjutorAPI();

export default adjutorAPI;