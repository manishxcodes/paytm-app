"use client"

import { Select } from "@repo/ui/components/select";
import { Button } from "@repo/ui/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Input } from "@repo/ui/components/shadcn/input";
import { useState } from "react";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}]

export function AddMoney() {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState<number>();

    return (
        <Card className="w-full min-w-lg min-h-[200]">
            <CardHeader>
                <CardTitle>Add Money</CardTitle>
            </CardHeader> 
            <CardContent>
                <CardDescription className="mb-2">Select bank</CardDescription>
                <Input className="mb-2"
                value={amount} type='number' placeholder="Enter amount" onChange={(e) => setAmount(Number(e.target.value))} />
                <Select onSelect={(value) => {
                    setRedirectUrl(value);
                }} options={SUPPORTED_BANKS.map(x => 
                    ({
                        key: x.name, value: x.redirectUrl
                    }))} />
                <div className="flex justify-center pt-4">
                    <Button onClick={() => {window.location.href = redirectUrl || ""}}>
                        Add Money
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}