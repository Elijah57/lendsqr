import {z} from "zod"

export const signupSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phoneno: z.string(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
})