"use server";

import { authOptions } from "@lib/auth";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";

export async function createOnRampTransaction (provider: string , amount: number 
)  {
    // ideally the token should come from the bancking provider (hdfc/ axis);

    const session = await getServerSession(authOptions);
    if(!session?.user || !session.user?.id) {
        return {
            message: "unauthenticated request"
        }
    }

    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount*100
        }
    });

    return {
        message: "Done"
    }
}