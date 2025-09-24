

// import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
// import { env } from "@/lib/env";
// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";


// const aj = arcjet({
//     key: env.ARCJET_API_KEY!,
//     rules: [
//         detectBot({
//             mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
//             allow: [
//                 "CATEGORY:SEARCH_ENGINE",
//                 "CATEGORY:MONITOR",
//                 "CATEGORY:PREVIEW",
//                 "STRIPE_WEBHOOK"
//             ],
//         }),
//     ],
// });

// async function authMiddleware(request: NextRequest) {
//     const sessionCookie = getSessionCookie(request);


//     if (!sessionCookie) {
//         return NextResponse.redirect(new URL("/login", request.url));
//     }

//     return NextResponse.next();
// }


// export const config = {
//     matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// export default createMiddleware(aj, async (request: NextRequest) => {
//     if (request.nextUrl.pathname.startsWith("/admin/")) {
//         return authMiddleware(request);
//     }
//     return NextResponse.next();
// });

import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { env } from "@/lib/env";

// ✅ Arcjet config separated (smaller + tree-shaking)
const aj = arcjet({
    key: env.ARCJET_API_KEY!,
    rules: [
        detectBot({
            mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:MONITOR",
                "CATEGORY:PREVIEW",
                "STRIPE_WEBHOOK",
            ],
        }),
    ],
});

// ✅ Only run auth on admin routes
async function authMiddleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

// ✅ Restrict matcher: don't run on all routes, only /admin & API
export const config = {
    matcher: [
        "/admin/:path*", // protect admin pages
        "/api/:path*",   // apply arcjet rules to API routes
    ],
    runtime: "nodejs"
};

// ✅ Middleware runner
export default createMiddleware(aj, async (request: NextRequest) => {
    if (request.nextUrl.pathname.startsWith("/admin/")) {
        return authMiddleware(request);
    }
    return NextResponse.next();
});

