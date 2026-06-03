import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDX lesson/case bodies are read from disk at request time; make sure the
  // content dir is traced into the serverless bundle on Vercel.
  outputFileTracingIncludes: {
    "/lesson/[slug]": ["./content/**/*"],
    "/cases/[slug]": ["./content/**/*"],
  },
};

export default nextConfig;
