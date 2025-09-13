import { env } from "@/lib/env";


export const useConstructUrl = (fileKey: string): string => {
    if (!fileKey) return "";
    const originalUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storage.dev/${fileKey}`;
    return `/api/image?url=${encodeURIComponent(originalUrl)}`;
}