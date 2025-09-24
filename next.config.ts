import type { NextConfig } from "next";
import { env } from "./lib/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        port: '',
        hostname: `${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storage.dev`,
      }
    ]
  }
};

export default nextConfig;
