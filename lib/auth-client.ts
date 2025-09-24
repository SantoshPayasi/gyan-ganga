import { createAuthClient } from "better-auth/react"
import { emailOTPClient, adminClient } from "better-auth/client/plugins"
import { env } from "./env"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: env.BETTER_AUTH_URL,
    plugins: [
        emailOTPClient(),
        adminClient()
    ]
})