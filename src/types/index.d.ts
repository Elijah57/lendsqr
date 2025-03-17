
declare module "express-serve-static-core" {
    interface Request {
      user?: any
    }
  }


// wallet service
export interface IcreateWallet {
    userId: string,
    accountName: string
}

export interface IFundWallet {
    amount: number,
    userId: string,
}

export interface IWithdrawWallet {
    amount: number,
    
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
// export interface verifyPayment

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


