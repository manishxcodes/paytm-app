"use client";

import { Button } from '@repo/ui/components/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card';
import { Input } from '@repo/ui/components/shadcn/input';
import { useState } from 'react';
import { p2pTransfer } from '@lib/actions/p2pTransfer';

export default function p2p_Transfer () {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState<number>();

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='min-w-sm p-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Send Money</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <Input type='text' placeholder='enter phone number' value={number} onChange={(e) => setNumber(e.target.value)} />
                        <Input type='amount' placeholder='enter amount' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    </CardContent>
                    <CardFooter className='w-full'>
                        <Button onClick={async() => {
                            if(!number || !amount) {
                                return;
                            }

                            await p2pTransfer(number, amount)
                        }}>Send</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}