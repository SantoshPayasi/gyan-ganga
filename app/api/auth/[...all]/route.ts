// import { auth } from "@/lib/auth"; // path to your auth file
// import { toNextJsHandler } from "better-auth/next-js";

// export const { POST, GET } = toNextJsHandler(auth);



auth
import { Arcjet } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import ip from "@arcjet/ip";
import arcjet, {
    type ArcjetDecision,
    type BotOptions,
    type EmailOptions,
    type ProtectSignupOptions,
    type SlidingWindowRateLimitOptions,
    detectBot,
    protectSignup,
    shield,
    slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";



const emailOptions = {
    mode: env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
    mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
    // configured with a list of bots to allow from
    // https://arcjet.com/bot-list
    allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

const rateLimitOptions = {
    mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
    interval: "2m", // counts requests over a 2 minute sliding window
    max: 5, // allows 5 submissions within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
    email: emailOptions,
    bots: botOptions,
    rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

async function protect(req: NextRequest): Promise<ArcjetDecision> {
    const session = await auth.api.getSession({
        headers: req.headers,
    });


    let userId: string;
    if (session?.user.id) {
        userId = session.user.id;
    } else {
        userId = ip(req) || "127.0.0.1"; // Fall back to local IP if none
    }

    if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {

        const body = await req.clone().json();
        if (typeof body.email === "string") {

            return Arcjet.withRule(protectSignup(signupOptions)).protect(req, { email: body.email, fingerprint: userId });

        } else {

            // Otherwise use rate limit and detect bot
            return Arcjet
                .withRule(detectBot(botOptions))
                .withRule(slidingWindow(rateLimitOptions))
                .protect(req, { fingerprint: userId });
        }
    } else {
        // For all other auth requests
        return Arcjet.withRule(detectBot(botOptions)).protect(req, { fingerprint: userId });
    }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

// Wrap the POST handler with Arcjet protections
export const POST = async (req: NextRequest) => {
    const decision = await protect(req);

    console.log("Arcjet Decision:", decision);

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return new Response(null, { status: 429 });
        } else if (decision.reason.isEmail()) {
            let message: string;

            if (decision.reason.emailTypes.includes("INVALID")) {
                message = "Email address format is invalid. Is there a typo?";
            } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "We do not allow disposable email addresses.";
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message =
                    "Your email domain does not have an MX record. Is there a typo?";
            } else {
                // This is a catch all, but the above should be exhaustive based on the
                // configured rules.
                message = "Invalid email.";
            }

            return Response.json({ message }, { status: 400 });
        } else {
            return new Response(null, { status: 403 });
        }
    }

    return authHandlers.POST(req);
};