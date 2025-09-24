import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireUser = cache(
    async () => {
        const user = await auth.api.getSession({ headers: await headers() });
        if (!user) {
            redirect("/login");
        }
        return user.user
    }
)
