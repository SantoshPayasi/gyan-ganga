"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/useConfetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const { triggerConfetti, ready } = useConfetti();

    useEffect(() => {
        if (ready) {
            triggerConfetti();
        }
    }, [ready, triggerConfetti]);

    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]">
                <CardContent>
                    <div className="flex justify-center items-center">
                        <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Successful</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                            Congrats, your payment was successful. You can now access the course.
                        </p>
                        <Link href="/dashboard" className={buttonVariants({ className: "w-full mt-5" })}>
                            <ArrowLeft /> Go Back to Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
