import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";

interface TransactionsProps {
    time: Date,
    amount: number,
    status: string,
    provider: string
}[]

interface OnRampTransactionProps {
    transactions: TransactionsProps[]
}

export function OnRampTransaction ({transactions}: OnRampTransactionProps) {
    if(!transactions.length) {
        return (
            <Card className="w-full min-w-lg p-6">
                <CardHeader>
                    <CardTitle>Recent Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                    No recent transaction
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full min-w-lg">
            <CardHeader>
                <CardTitle>Recent Transaction</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    transactions.map(t => (
                        <div className="flex justify-between">
                             <div>
                                <span className="text-sm">Recieved INR</span>
                             </div>
                             <div>
                                <span className="text-slate-600 text-xs">{t.time.toDateString()}</span>
                             </div>
                             <div className="flex flex-col justify-center">
                                + Rs {t.amount/100}
                             </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    )
}