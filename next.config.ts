import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
  serverExternalPackages: [
    "firebase-admin",
    "nodemailer",
    "google-auth-library",
    "gcp-metadata",
    "@google-cloud/storage",
    "https-proxy-agent",
    "http-proxy-agent",
    "agent-base",
    "gtoken",
    "@firebase/database-compat",
  ],
};

export default nextConfig;
