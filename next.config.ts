import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'www.youtube.com' },
      { protocol: 'http', hostname: '127.0.0.1' },
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
