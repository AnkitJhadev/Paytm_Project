import express from 'express'
import { PrismaClient } from '@prisma/client'

// Create Prisma client instance
const db = new PrismaClient()

// Type assertion to bypass TypeScript cache issues
const prisma = db as any

const app = express()

// Middleware
app.use(express.json())

app.post('/hdfcwenhook', async (req, res) => {


    try {
        const paymentInformation = {
            token: req.body.token,
            userID: req.body.user_identifier,
            amount: req.body.amount
        }

        await prisma.$transaction([
            prisma.balance.update({
              where: { userId: paymentInformation.userID },
              data: { amount: { increment: paymentInformation.amount } },
            }),
            prisma.onRampTransaction.update({
              where: { token: paymentInformation.token },
              data: { status: "Success" },
            })
          ]);

        res.status(200).json({ success: true, message: 'Balance updated successfully' })
    } catch (error) {
        console.error('Error updating balance:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Bank webhook server running on port ${PORT}`)
})