import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const session = await getServerSession(authOptions);
        if(session.user) {
            return NextResponse.json({
                user: session.user
            })
        }
    } catch(err) {
        return NextResponse.json({
            message: "You are not logged in",
            error: err
        }, {status: 403})
    }
    return NextResponse.json({
            message: "You are not logged in"
    }, {status: 403})
}