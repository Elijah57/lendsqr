
declare module "express-serve-static-core" {
    interface Request {
      user?: any,
      
    }
  }


// wallet service
export interface IcreateWallet {
    userId: string,
    accountName: string
}

export interface IFundWallet {
    amount: number,
    email: string,
    reference?: string
}

export interface IWithdrawWallet {
    amount: number,
    userId: string
    receiver: {
        account_name: string,
        account_number: string
    },
    description?: string
    
}

export interface ITransferDetails {
    sender?: string,
    receiver: string
    amount: number,
    description: string
}


// Auth Service
export interface ISignup {
    firstname: string,
    lastname: string,
    phoneno: string,
    email: string,
    password: string,
}

export interface IUsers {
    id?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    phoneno:string,
    passwordhash?: string,
    isverified?: boolean
}

export interface Ilogin{
    email: string,
    password: string
}

export interface IAuthPayload{
    id: string,
    email: string
}

// 
export interface IWallet {
    id: string,
    balance: number,
    currency: string
}


export interface ITransaction {
    id: string,
    from: string,
    to: string,
    type: string,
    timestamp: Date
}




// paystack


export interface initializePaymentDetails {
    email: string,
    amount: string,
    callback_url?: string,
    metadata?: {
        email: string,
        amount: string
        name: string
    }
}

export interface initializePaymentRawResponse {
    status: boolean,
    message: string,
    data: {
        authorization_url: string,
        access_code: string,
        reference: string
    }
}

export interface verifyPaymentReferenceResponse {
    status: boolean,
    message: string,
    data: {
        amount: number,
        reference: string
        status: string,
        metadata: {
            email: string,
            amount: number,
            name: string
        }
    },
}


export interface ITransferReceipt{
    type: string,
    name: string,
    account_number: string,
    bank_code: string,
    currency: string

}

export interface ITransferReceiptResponse {

    status: boolean,
    message: string,
    data: {
        active?: boolean,
        createdAt?: string,
        currency?: string,
        domain?: string,
        id?: string,
        integration?: string,
        name: string,
        receipt_code: string,
        type: string,
        updatedAt: string,
        is_deleted: boolean,
        details: {
            authorization_code: any,
            account_number: string,
            account_name: string,
            bank_code: string,
            bank_name: string
        }
    },
}
export interface IBankResolveResponse {
    status: boolean,
    message: string,
    data: {
        account_number: string,
        account_name: string
    },
    bank_code: string
}

export interface IBankresolve {
    account_number: string,
    bank_code: string
}

export interface IBankCodeResponse{
    status: string,
    message: string,
    data: [{
        name: string,
        code: string,
        slug: string,
        longcode: string,
        country: string,
        currency: string
    }]
}

export interface IAccountDetails{
    bank_name: string,
    account_number: string
}

// Adjutor
export interface IKarmaResponse {
    karma_identity: string,
    amount_in_contention: string,
    reason: string,
    default_date: Date,
    karma_type: object,
    karma_identity_type: object,
    reporting_entity: object

}


