import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "@/lib/s3-client";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "File name is required" }),
    contentType: z.string().min(1, { message: "File type is required" }),
    size: z.number().min(1, { message: "size is required" }),
    isImage: z.boolean()
})

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                message: validation.error.issues[0].message
            })
        }

        const { fileName, contentType, size } = validation.data;

        const uniqueKey = `${uuidv4()}.${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const presignedUrl = await getSignedUrl(s3, command, {
            expiresIn: 360 //url will be expired in 6 minutes
        });

        const response = {
            signedUrl: presignedUrl,
            key: uniqueKey
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}