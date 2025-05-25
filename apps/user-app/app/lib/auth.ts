import  CredentialsProvider  from "next-auth/providers/credentials"
import { prisma } from "@repo/db"
import bcrypt from "bcrypt"
import { z } from "zod"
import { CredentialsTypes } from "../types/auth.types"

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Enter your email", type: "text", placeholder: "johncena@gmail.com"},
                password: {
                    label: "Enter password", 
                    type: "password"
                }
            }, 
            async authorize(credentials: CredentialsTypes ) {
                // zod validation
                const response = credentialsSchema.safeParse(credentials);
                if(!response.success) return null;

                if(!credentials?.email || !credentials.password) return null;
                try {
                    const existingUser = await prisma.user.findFirst({
                    where: {
                            email: credentials.email
                        }
                    });

                    if(existingUser) {
                        // check if password is valid 
                        const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                        if(isPasswordValid) {
                            return {
                                id: existingUser.id.toString(),
                                name: existingUser.firstName + " " + existingUser.lastName,
                                number: existingUser.number,
                                email: existingUser.email
                            };
                        }
                    }

                    // if user doesnot exist return null
                    return null;
                } catch(err) {
                    console.log("error", {details: err});
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({token, session}: any ) {
            session.user.id = token.sub;
            return session;
        }
    }
}