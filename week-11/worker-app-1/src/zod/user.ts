import {z} from "zod";

export const userSignupSchema = z.object({
     username: z.string(),
     password: z.string(),
     email:    z.string().email(),    
});

export const userSigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
