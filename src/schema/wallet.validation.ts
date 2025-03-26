import {z} from "zod"

export const transferSchema = z.object({
    receiver: z.string().max(10, "Account number cannot exceed 10 digits"),
    amount: z.number().refine(n => n > 100, "Amount must exceed 100"),
    description: z.string().max(25, "Exceeded limit")
    
})

export const fundSchema = z.object({
    amount: z.number().refine(n => n > 100, "Amount must exceed 100")
})


export const bankResolveSchema = z.object({
    account_number: z.string().max(10, "Account number cannot exceed 10 digits"),,
    bank_name: z.string()
})

export const withdrawSchema = z.object({
    account_number: z.string().max(10, "Account number cannot exceed 10 digits"),
    bank_name: z.string(),
    amount: z.number().refine(n => n > 100, "Amount must exceed 100"),
    description: z.string().max(40, "Exceeded limit")
})