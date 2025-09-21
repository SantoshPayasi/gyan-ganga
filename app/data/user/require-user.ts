import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
    const user = await auth.api.getSession({ headers: await headers() });
    if (!user) {
        redirect("/login");
    }
    return user;
}