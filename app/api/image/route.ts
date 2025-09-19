// // app/api/image/route.ts
// import { NextResponse } from "next/server";

// const ALLOWED_DOMAIN = "t3.storage.dev";

// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const url = searchParams.get("url");


//     if (!url) {
//         return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
//     }

//     try {
//         const targetUrl = new URL(url);


//         if (!targetUrl.hostname.endsWith(ALLOWED_DOMAIN)) {
//             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }

//         const res = await fetch(targetUrl.toString(), { cache: "no-store" });

//         if (!res.ok) throw new Error("Upstream fetch failed");

//         const contentType = res.headers.get("content-type") || "image/png";
//         const buffer = await res.arrayBuffer();

//         return new NextResponse(buffer, {
//             headers: {
//                 "Content-Type": contentType,
//                 "Cache-Control": "public, max-age=31536000, immutable",
//             },
//         });
//     } catch (err) {
//         console.error("Image proxy error:", err);

//         return NextResponse.redirect("/fallback-thumbnail.png");
//     }
// }
// app/api/image/route.ts
import { NextResponse } from "next/server";

const ALLOWED_DOMAIN = "t3.storage.dev";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    try {
        const targetUrl = new URL(url);

        if (!targetUrl.hostname.endsWith(ALLOWED_DOMAIN)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const res = await fetch(targetUrl.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error("Upstream fetch failed");

        // detect content type
        const contentType =
            res.headers.get("content-type") ||
            "application/octet-stream"; // safer fallback

        // Only allow image/* or video/*
        if (!/^image\//.test(contentType) && !/^video\//.test(contentType)) {
            return NextResponse.json({ error: "Unsupported media type" }, { status: 415 });
        }

        const buffer = await res.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (err) {
        console.error("Image proxy error:", err);

        // If upstream fails → send fallback image
        return NextResponse.redirect("/fallback-thumbnail.png");
    }
}
