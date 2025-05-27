import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { generateOTP } from "otp-agent"
import { z } from "zod"
import { prisma } from "@repo/db"
import { date, iso } from "zod/v4"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD
    }
});

export async function POST(req: NextRequest) {
    const {to} = await req.json();

    // zod validation
    const response = z.string().email().safeParse(to);
    if(!response) {
        return NextResponse.json({message: "Invalid email / no email"});
    }

    // check if user alreay exist. if yes the tell them to signin
    const existingUser = await prisma.user.findFirst({
        where: {
            email: to
        }
    });
    if(existingUser) {
        return NextResponse.json({message: "User already exists. Please Signin"});
    }

    // create otp 
    const otp = generateOTP();
        if(!otp) {
        return NextResponse.json({message: "Error while generating OTP"});
    }
   
    // configure email
    const mailOptions = {
        from : `"Manish" <${process.env.USER_EMAIL}>`,
        to,
        subject: "OTP for your payment app",
        text: "Please don't share you otp with other. Use it before 2 min or it will be invalid",
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    }

    // send otp 
    const info = await transporter.sendMail(mailOptions);
    // check if otp not send return error 
    if(!info.accepted) {
        return NextResponse.json({message: "Failed to send OTP"}, {status: 500});
    }    

    // save otp in db
    try {
        const res = await prisma.otp.create({
            data: {
                email: to,
                otp: otp,
                createdAt: new Date(Date.now() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000)),      // converting utc to itc
                expiresAt: new Date(Date.now() + (5 * 60 * 60 * 1000) + (32 * 60 * 1000)) // 2 minutes
                //(addHours * 60 * 60 * 1000) + (addMinutes * 60 * 1000)
            }
        })
        // if otp sent return success 
        if(res) {
            return NextResponse.json({message: "OTP sent successfully"});
        }
    } catch(err) {
        console.log("Error while updating otp in db", {details: err});
        return NextResponse.json({message: "Error while updating otp in db"}, {status: 500});
    }

    return NextResponse.json({message: "Something went wrong"}, {status: 500})
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (!email || !otp) {
        return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }


    const verifyOtpSchema = z.object({
        email: z.string().email(),
        otp: z.string().length(6)
    })
    const response = await verifyOtpSchema.safeParse({email, otp});
    if(!response.success) {
        return NextResponse.json({message: "Invalid OTP or email"});
    }

    // check if otp is valid from db
    const isOtpValid = await prisma.otp.findFirst({
        where:{
            email: email,
            otp: otp
        }
    })

    if(!isOtpValid) {
        return NextResponse.json({message: "OTP is incorrect or expired"}, {status: 401});
    }

    return NextResponse.json({ message: "OTP verifired successfully"}, {status: 200})
}