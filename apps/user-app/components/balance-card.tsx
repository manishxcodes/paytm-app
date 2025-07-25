import { Card } from "@repo/ui/components/shadcn/card";

interface BalanceCardProps {
    amount: number,
    locked: number
}

export function BalanceCard ({amount, locked}: BalanceCardProps) {
    return (
        <Card className="w-full min-w-lg p-6">
            <div className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Unlocked balance
            </div>
            <div>
                {amount / 100} INR
            </div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>
                    Total Locked Balance
                </div>
                <div>
                    {locked / 100} INR
                </div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>
                    Total Balance
                </div>
                <div>
                    {(locked + amount) / 100} INR
                </div>
            </div>
        </Card>
    )
}