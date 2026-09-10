import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@maya/shared", "@maya/database"],
};

export default nextConfig;
