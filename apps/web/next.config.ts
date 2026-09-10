import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@maya/shared", "@maya/database"],
  serverExternalPackages: ["@openrouter/sdk"],
};

export default nextConfig;
