"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"
import { randomUUID } from "crypto"

export async function createOnRampTxn(amount: number, provider: string) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return {
			message: "user not logged in"
		}
	}

	const token = randomUUID()

	await prisma.onRampTransaction.create({
		data: {
			userId: Number(userId),
			amount: Number(amount),
			status: "Processing",
			provider,
			token,
			startTime: new Date()
		}
	})

	return {
		message: "transaction added successfully",
		token
	}
}