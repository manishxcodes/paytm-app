import { AddMoney } from "@components/add-money-card";
import { BalanceCard } from "@components/balance-card";
import { OnRampTransaction } from "@components/onramp-transaction";
import { authOptions } from "@lib/auth"
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth"

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransaction() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });

    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function Transfer() {
    const balance = await getBalance();
    const transactions = await getOnRampTransaction();

    return (
        <div className="w-full p-4">
            <div>
                <h2 className="scroll-m-20 border-b border-b-black pb-2 text-3xl font-semibold text-secondary tracking-tight first:mt-0">
                    Transfer
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 ">
                <div className="">
                    <AddMoney />
                </div>
                <div className="flex flex-col gap-2 ">
                    <div>
                        <BalanceCard amount={balance.amount} locked={balance.locked} />
                    </div>
                    <div>
                        <OnRampTransaction transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    )
}