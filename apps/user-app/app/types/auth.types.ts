import { z } from "zod";

export type CredentialsTypes = {
    email: string;
    password: string;
} | undefined

export interface AuthUser {
    id: string
    name: string 
    email: string 
    number: string
}

export const userDataSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, { message: "First name cannot be empty" }),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, { message: "Last name cannot be empty" }),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter a valid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type UserData = z.infer<typeof userDataSchema>