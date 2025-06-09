import { prisma } from "@repo/db";
import { UserData, userDataSchema } from "../../../types/auth.types";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
    // get all the inputs 
    const body:UserData = await req.json();

    // zod validation
    const response = userDataSchema.safeParse(body);
    if(!response) {
        return NextResponse.json({message: "Invalid credentials"});
    }

    // check if user exists 
    const existingUser = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    });
        
    // if exists then tell them to signin
    if(existingUser) {
        return NextResponse.json({message: "This email has already been registered by an user. Please signin"});
    }

    // hashpassword
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // if new user create account
    try {
        console.log({body: body});
        const res = await prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                number: body.phoneNumber,
                password: hashedPassword,
            }
        });
        if(res) {
            return NextResponse.json({message: "User Created Successfully"});
        }
    } catch(err) {
        console.log("Failed to signup", {details: err});
        return NextResponse.json({message: "Failed to Signup"}, {status: 500});
    }

    return NextResponse.json({message: "Something went wrong"}, {status: 500});
}

export async function GET(req: NextRequest) {
    return NextResponse.json({hello: "there"})
}