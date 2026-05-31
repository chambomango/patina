import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // sources for Images from next/image
    remotePatterns: [{ protocol: "https", hostname: "i.ebayimg.com" }],
  },
};

export default nextConfig;
