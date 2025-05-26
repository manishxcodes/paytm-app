import { NextResponse } from "next/server";

export function GET() {
    // get all the inputs 
    // check if user exists 
    // if exists then tell them to signin
    // if not 
    //      - verify otp
    //      -create new user
    return NextResponse.json({hello: "there"})
}