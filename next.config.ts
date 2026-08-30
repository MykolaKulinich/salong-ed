import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sd/js/script.js",
        destination: "https://plausible.io/js/pa-TLJKO1hs8OH95HzKUdyiV.js",
      },
      {
        source: "/sd/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
};

export default nextConfig;
