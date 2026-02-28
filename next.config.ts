import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
