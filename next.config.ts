import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.ngrok-free.dev', 'virtually-unlanded-jacquelyne.ngrok-free.dev'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
