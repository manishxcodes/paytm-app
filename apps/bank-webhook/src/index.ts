import express from "express"
import { prisma } from "@repo/db"

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
    // todo: zod validation
    // check if this request came from hdfc bank, use a webhook secret here
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: Number(req.body.amount)
    };

    try {
        await prisma.$transaction([
            // update balance in db, add transcation
            prisma.balance.update({
                where: {
                    userId: paymentInfo.userId
                },
                data: {
                    amount: {
                        increment: paymentInfo.amount
                    }
                }
            }),
            prisma.onRampTransaction.update({
                where: {
                    token: paymentInfo.token
                },
                data: {
                    status: "Success"
                }
            })
        ])

        res.json({
            message: "Captured"
        }).status(200);
    } catch(err) {
        console.error({details: err})
        res.json({
            message: "Error while processing webhook",
            err: err
        }).status(411);
    }
})

app.listen(port, () => {
    console.log( `listening on port ${port}`);
})