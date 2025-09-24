import { env } from "@/lib/env";


export const useConstructUrl = (fileKey: string): string => {
    if (!fileKey) return "";
    const originalUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storage.dev/${fileKey}`;
    return `/api/image?url=${encodeURIComponent(originalUrl)}`;
}


export const useConstructJustUrl = (fileKey: string): string => {
    if (!fileKey) return "";
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storage.dev/${fileKey}`;

}