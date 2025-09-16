import { requireAdmin } from "@/app/data/admin/require-admin";
import { Arcjet, detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


const aj = Arcjet.withRule(
    detectBot({
        mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        allow: [],

    })
).withRule(
    fixedWindow({
        mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        window: "1m",
        max: 5,
    })
)

export async function DELETE(request: Request) {
    const session = await requireAdmin();
    try {
        const decision = await aj.protect(request, {
            fingerprint: session?.user.id as string
        });


        if (decision.isDenied()) {
            return NextResponse.json({ message: "You are not allowed to delete files" }, { status: 429 });
        }
        const body = await request.json();
        const { key } = body;

        if (!key) {
            return NextResponse.json({
                success: false,
                message: "File key is required"
            }, { status: 400 })
        }
        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key
        })


        await s3.send(command);
        return NextResponse.json({
            success: true,
            message: "File deleted successfully"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete file"
        }, { status: 500 })
    }
}