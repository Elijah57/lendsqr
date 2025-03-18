import config from "../configs";
import { IBankCodeResponse, IBankResolveResponse, initializePaymentDetails, initializePaymentRawResponse, ITransferReceipt, ITransferReceiptResponse, verifyPaymentReferenceResponse } from "../types";
import BaseAPI from "./baseApi";

class PaystackAPI extends BaseAPI{

    RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
    }
    constructor(){
        super(config.paystackUrl as string)
    }

    initializePayment = async (paymentDetails: initializePaymentDetails)=>{

        const response = await this.post<initializePaymentRawResponse>("/transaction/initialize", paymentDetails, undefined, this.RequestInit)
        return response.data
    }

    createTransferReceipt = async (transferReciptDetails: ITransferReceipt)=>{

        const response = await this.post<ITransferReceiptResponse>("/transferrecipient", transferReciptDetails, undefined, this.RequestInit)
        return response
    }

    verifyPayment = async (paymentReference: string)=>{

        const response = await this.get<verifyPaymentReferenceResponse>(`/transaction/verify/${paymentReference}`, undefined, this.RequestInit)
        return response
    }

    bankResolve = async (data: Record<string, any>)=>{
        const response = await this.get<IBankResolveResponse>(`/bank/resolve`, data, this.RequestInit)
        return response
    }

    getBankCode = async ()=>{
        const response = await this.get<IBankCodeResponse>(`/bank`, undefined, this.RequestInit)
        return response
    }

}


const paystackApi = new PaystackAPI();

export default paystackApi;