"use srver";

import { authOptions } from "@lib/auth";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";

export async function p2pTransfer (to: string, amount: number) {
    const session = await getServerSession(authOptions);

    const from = session?.user?.id;
    if(!from) {
        return {
            message: "Error while sending"
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    })

    if(!toUser) {
        return {
            message: "user not found"
        }
    }

    await prisma.$transaction(async (tx) => {
        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(from)
            }
        });
        if(!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient balanc");
        }

        await tx.balance.update({
            where: {
                userId: Number(from)
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        });

        await tx.balance.update({
            where: {
                userId: Number(toUser.id)
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        });
    });
}