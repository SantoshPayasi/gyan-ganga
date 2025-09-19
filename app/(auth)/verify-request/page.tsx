"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [verificationPending, startVerifyAccountTransaction] = useTransition();
    const params = useSearchParams();
    const email = params.get("email") as string;
    const isOtpCompleted = otp.length === 6;
    function verifyOtp() {
        startVerifyAccountTransaction(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp,
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error("error while verifying otp :" + error.error.message);
                    }
                }
            })
        })
    }
    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your mail</CardTitle>
                <CardDescription>We have sent a verification code to your email address,
                    Please open the email and paste the code below
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP maxLength={6} className="gap-2" value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}></InputOTPSlot>
                            <InputOTPSlot index={1}></InputOTPSlot>
                            <InputOTPSlot index={2}></InputOTPSlot>
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3}></InputOTPSlot>
                            <InputOTPSlot index={4}></InputOTPSlot>
                            <InputOTPSlot index={5}></InputOTPSlot>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code send to your email</p>
                </div>
            </CardContent>
            <Button className="mx-3" onClick={verifyOtp} disabled={verificationPending || !isOtpCompleted}>
                {
                    verificationPending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Verify Account"
                }
            </Button>
        </Card>
    )
}