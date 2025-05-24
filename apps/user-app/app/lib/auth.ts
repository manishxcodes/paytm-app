import  CredentialsProvider  from "next-auth/providers/credentials"
import { prisma } from "@repo/db"
import bcrypt from "bcrypt"


type CredentialsTypes = {
    phone: string;
    password: string;
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: {label: "Enter your number", type: "text", placeholder: "9876543210"},
                password: {
                    label: "Enter password", 
                    type: "password"
                }
            }, 
            async authorize(credentials: any) {
                // zod validation
                const existingUser = await prisma.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if(existingUser) {
                    // check if password is valid 
                    const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                    if(isPasswordValid) {
                        console.log("yes");
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            number: existingUser.number
                        };
                    }
                }

                // if user doesnot exist return null
                console.log("no")
                return null;
            }
        })
    ],
    pages: {
        signIn: "auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({token, session}: any ) {
            session.user.id = token.sub;
            return session;
        }
    }
}