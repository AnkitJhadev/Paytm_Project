"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

export async function sendMoney(phoneNumber: string, amount: number) {
    const session = await getServerSession(authOptions)
    const fromUserId = session?.user?.id

    if (!fromUserId) {
        return {
            success: false,
            message: "User not logged in"
        }
    }

    if (!phoneNumber || !amount || amount <= 0) {
        return {
            success: false,
            message: "Invalid phone number or amount"
        }
    }

    try {
        // Find the recipient user by phone number
        const toUser = await prisma.user.findUnique({
            where: {
                number: phoneNumber
            }
        })

        if (!toUser) {
            return {
                success: false,
                message: "Recipient not found. Please check the phone number."
            }
        }

        if (toUser.id === Number(fromUserId)) {
            return {
                success: false,
                message: "Cannot send money to yourself"
            }
        }

        // Get sender's balance
        const fromBalance = await prisma.balance.findFirst({
            where: {
                userId: Number(fromUserId)
            }
        })

        if (!fromBalance || fromBalance.amount < amount) {
            return {
                success: false,
                message: "Insufficient balance"
            }
        }

        // Get or create recipient's balance
        let toBalance = await prisma.balance.findFirst({
            where: {
                userId: toUser.id
            }
        })

        if (!toBalance) {
            toBalance = await prisma.balance.create({
                data: {
                    userId: toUser.id,
                    amount: 0,
                    locked: 0
                }
            })
        }

        // Perform the transfer in a transaction
        await prisma.$transaction(async (tx) => {
            // Deduct from sender
            await tx.balance.update({
                where: {
                    userId: Number(fromUserId)
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            })

            // Add to recipient
            await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            })
        })

        return {
            success: true,
            message: `Successfully sent ₹${amount} to ${toUser.name || phoneNumber}`
        }

    } catch (error) {
        console.error("Send money error:", error)
        return {
            success: false,
            message: "Failed to send money. Please try again."
        }
    }
}
