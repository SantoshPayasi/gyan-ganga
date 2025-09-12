import "server-only";


import { auth } from "@/lib/auth"
import { headers } from "next/dist/server/request/headers"
import { redirect } from "next/navigation";
import { Session } from "better-auth";

export async function requireAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return redirect("/login");
    }

    if (session.user.role !== "admin") {
        return redirect("/not-admin");
    }

    return session;
}