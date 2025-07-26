import { prisma } from "@repo/db"
import bcrypt from 'bcrypt' 

async function main() {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash("password", salt); 

    const alice = await prisma.user.upsert({
        where: {
            number: '9999999999',
        }, 
        update: {},
        create: {
            number: '9999999999',
            password:hashedPassword,
            firstName: 'alice',
            lastName: 'borderland',
            email: 'aliceinborderland@ggmail.com',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: '122',
                    provider: "HDFC Bank"
                }
            }
        }
    })

    const bob = await prisma.user.upsert({
        where: {number: '9999999998'},
        update: {},
        create: {
            number: "9999999998",
            password: hashedPassword,
            firstName: "bob D",
            lastName: "builder",
            email: "bobthebuilder@ggmail.com",
            OnRampTransaction: {
                create: {
                startTime: new Date(),
                status: "Failure",
                amount: 2000,
                token: "123",
                provider: "HDFC Bank",
                },
            }
        }
    })

    console.log({alice, bob});
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
})