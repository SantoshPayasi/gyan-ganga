"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function useSignOut() {
    const router = useRouter();
    const handleSignOut = async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signed out successfully")
                    router.push("/")
                },
                onError: (error) => {
                    toast.error("Failed to signout reason is : " + error.error.message);
                }
            }
        })
    }


    return handleSignOut;
}