"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState, useEffect } from "react";
import { sendMoney } from "../../lib/actions/sendMoney";

export default function Person2Person() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);

    // Fetch current balance on component mount
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const data = await response.json();
                    setCurrentBalance(data.balance || 0);
                }
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };
        fetchBalance();
    }, []);

    const handleSendMoney = async () => {
        // Clear previous messages
        setMessage("");

        // Validation
        if (!phoneNumber.trim()) {
            setMessage("Please enter recipient's phone number");
            return;
        }

        if (!amount || amount <= 0) {
            setMessage("Please enter a valid amount greater than 0");
            return;
        }

        if (phoneNumber.length < 10) {
            setMessage("Please enter a valid 10-digit phone number");
            return;
        }

        if (amount > currentBalance) {
            setMessage("Insufficient balance. Available: ₹" + currentBalance);
            return;
        }

        setIsLoading(true);

        try {
            const result = await sendMoney(phoneNumber.trim(), amount);
            if (result.success) {
                setMessage("Money sent successfully!");
                setPhoneNumber("");
                setAmount(0);
                // Update balance after successful transfer
                setCurrentBalance(prev => prev - amount);
            } else {
                setMessage(result.message || "Failed to send money");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
            console.error("Send money error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold flex items-center gap-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Send Money
            </div>
            <div className="flex justify-center p-4">
                <div className="w-full max-w-md">
                    <Card title="💸 Send Money to Friend">
                        <div className="w-full space-y-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="text-sm text-gray-600">Available Balance</div>
                                <div className="text-lg font-semibold text-gray-800">₹{currentBalance}</div>
                            </div>
                            <TextInput 
                                label="Phone Number" 
                                placeholder="Enter recipient's phone number" 
                                onChange={(value) => setPhoneNumber(value)} 
                            />
                            
                            <TextInput 
                                label="Amount (₹)" 
                                placeholder="Enter amount to send" 
                                onChange={(value) => {
                                    const parsed = parseInt(value || "0", 10);
                                    setAmount(Number.isFinite(parsed) ? parsed : 0);
                                }} 
                            />

                            <div className="space-y-2">
                                <div className="text-sm text-gray-600">Quick amounts:</div>
                                <div className="flex gap-2 flex-wrap">
                                    {[100, 500, 1000, 2000, 5000].map((quickAmount) => (
                                        <button
                                            key={quickAmount}
                                            onClick={() => setAmount(quickAmount)}
                                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
                                        >
                                            ₹{quickAmount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {amount > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="text-sm text-blue-800">
                                        <strong>Transfer Summary:</strong>
                                    </div>
                                    <div className="text-sm text-blue-700 mt-1">
                                        Sending ₹{amount} to {phoneNumber || "recipient"}
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${
                                    message.includes("successfully") 
                                        ? "bg-green-100 text-green-800 border border-green-200" 
                                        : "bg-red-100 text-red-800 border border-red-200"
                                }`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex justify-center pt-4">
                                <Button 
                                    onClick={handleSendMoney}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending..." : "Send Money"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}