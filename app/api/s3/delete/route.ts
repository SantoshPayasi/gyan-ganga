import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
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

    try {
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