import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le guide PDF n'est lu que par /api/guide : il doit être embarqué avec cette route en production.
  outputFileTracingIncludes: {
    "/api/guide": ["./private/guide-prospections-longrich.pdf"],
  },
};

export default nextConfig;
