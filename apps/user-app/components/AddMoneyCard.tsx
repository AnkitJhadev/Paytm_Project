"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { OnRampTransactions } from "./OnRampTransactions";
import { createOnRampTxn } from "../app/lib/actions/createOnRamptxn";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {

	const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
	const [amount , setAmount] = useState(0)
	const [provider , setProvider] = useState(SUPPORTED_BANKS[0]?.name || "")

	const handleClick = async () => {
        try {
            // Create on-ramp transaction (wait for completion)
            await createOnRampTxn(amount, provider);
      
            // Redirect to the selected bank's URL
            if (redirectUrl) {
              window.location.href = redirectUrl; // 👈 this triggers browser redirect
            } else {
              alert("No redirect URL found for selected bank.");
            }
          } catch (error) {
            console.error("Failed to create on-ramp transaction:", error);
            alert("Something went wrong. Please try again.");
          }        
	}

    return <Card title="Add Money">
    <div className="w-full">
		<TextInput label={"Amount"} placeholder={"Amount"} onChange={(v) => {
			const parsed = parseInt(v || "0", 10)
			setAmount(Number.isFinite(parsed) ? parsed : 0)
		}} />
        <div className="py-4 text-left">
            Bank
        </div>
		<Select onSelect={(value) => {
			setProvider(value)
			setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
		}} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={handleClick}>
            Add Money
            </Button>
        </div>
    </div>
</Card>
}
