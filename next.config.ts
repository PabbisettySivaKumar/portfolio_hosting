import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/home",
        destination: "/",
      },
      {
        source: "/projects",
        destination: "/",
      },
      {
        source: "/playground",
        destination: "/",
      },
      {
        source: "/experience",
        destination: "/",
      },
      {
        source: "/about",
        destination: "/",
      },
      {
        source: "/contact",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
